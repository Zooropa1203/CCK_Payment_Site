import { Router } from 'express';
import type { Request, Response } from 'express';
import { Registration, Payment } from '../models/index.js';

const router = Router();

// 결제 정보 생성 (토스페이먼츠 연동 전)
router.post('/prepare', async (req: Request, res: Response) => {
  try {
    const { registration_id, payment_method = 'card' } = req.body;

    if (!registration_id) {
      return res.status(400).json({
        success: false,
        message: '등록 ID가 필요합니다.',
      });
    }

    // 등록 정보 확인
    const registration = await Registration.findByPk(registration_id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: '등록 정보를 찾을 수 없습니다.',
      });
    }

    // 이미 결제된 등록인지 확인
    if (registration.payment_status === 'paid') {
      return res.status(400).json({
        success: false,
        message: '이미 결제가 완료된 등록입니다.',
      });
    }

    // 결제 정보 생성
    const payment = await Payment.create({
      registration_id,
      amount: registration.total_fee,
      payment_method,
      status: 'pending',
      order_id: `CCK_${registration_id}_${Date.now()}`,
    });

    res.json({
      success: true,
      data: {
        payment_id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
        payment_method: payment.payment_method,
      },
    });
  } catch (error) {
    console.error('결제 준비 에러:', error);
    res.status(500).json({
      success: false,
      message: '결제 준비 중 오류가 발생했습니다.',
    });
  }
});

// 토스페이먼츠 결제 승인
router.post('/confirm', async (req: Request, res: Response) => {
  try {
    const { payment_id, payment_key, order_id, amount } = req.body;

    if (!payment_id || !payment_key || !order_id || !amount) {
      return res.status(400).json({
        success: false,
        message: '필수 결제 정보가 누락되었습니다.',
      });
    }

    // 결제 정보 확인
    const payment = await Payment.findByPk(payment_id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: '결제 정보를 찾을 수 없습니다.',
      });
    }

    // 금액 검증
    if (payment.amount !== amount) {
      return res.status(400).json({
        success: false,
        message: '결제 금액이 일치하지 않습니다.',
      });
    }

    // TODO: 실제 토스페이먼츠 API 호출하여 결제 승인
    // 현재는 가짜 승인으로 처리

    // 결제 상태 업데이트
    await payment.update({
      status: 'completed',
      payment_key,
      paid_at: new Date(),
    });

    // 등록 상태 업데이트
    const registration = await Registration.findByPk(payment.registration_id);
    if (registration) {
      await registration.update({
        payment_status: 'paid',
        registration_status: 'confirmed',
      });
    }

    res.json({
      success: true,
      data: {
        payment_id: payment.id,
        status: 'completed',
        paid_at: payment.paid_at,
      },
    });
  } catch (error) {
    console.error('결제 승인 에러:', error);
    res.status(500).json({
      success: false,
      message: '결제 승인 중 오류가 발생했습니다.',
    });
  }
});

// 결제 취소
router.post('/cancel', async (req: Request, res: Response) => {
  try {
    const { payment_id, reason = '사용자 요청' } = req.body;

    if (!payment_id) {
      return res.status(400).json({
        success: false,
        message: '결제 ID가 필요합니다.',
      });
    }

    const payment = await Payment.findByPk(payment_id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: '결제 정보를 찾을 수 없습니다.',
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: '완료된 결제만 취소할 수 있습니다.',
      });
    }

    // TODO: 실제 토스페이먼츠 API 호출하여 결제 취소

    await payment.update({
      status: 'cancelled',
      cancelled_at: new Date(),
      cancel_reason: reason,
    });

    // 등록 상태 업데이트
    const registration = await Registration.findByPk(payment.registration_id);
    if (registration) {
      await registration.update({
        payment_status: 'cancelled',
        registration_status: 'cancelled',
      });
    }

    res.json({
      success: true,
      data: {
        payment_id: payment.id,
        status: 'cancelled',
        cancelled_at: payment.cancelled_at,
      },
    });
  } catch (error) {
    console.error('결제 취소 에러:', error);
    res.status(500).json({
      success: false,
      message: '결제 취소 중 오류가 발생했습니다.',
    });
  }
});

// 결제 상태 조회
router.get('/:payment_id', async (req: Request, res: Response) => {
  try {
    const { payment_id } = req.params;

    const payment = await Payment.findByPk(payment_id, {
      include: [
        {
          model: Registration,
          as: 'Registration',
          attributes: [
            'id',
            'competition_id',
            'user_id',
            'total_fee',
            'registration_status',
          ],
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: '결제 정보를 찾을 수 없습니다.',
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('결제 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '결제 조회 중 오류가 발생했습니다.',
    });
  }
});

export default router;
