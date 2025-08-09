import { Router } from 'express';
import type { Request, Response } from 'express';
import { Registration, Competition, User } from '../models/index.js';
import { Op } from 'sequelize';

const router = Router();

// 대회 등록
router.post('/', async (req: Request, res: Response) => {
  try {
    const { competition_id, user_id, selected_events } = req.body;

    if (!competition_id || !user_id || !selected_events || !Array.isArray(selected_events)) {
      return res.status(400).json({
        success: false,
        message: '필수 필드가 누락되었습니다.',
      });
    }

    // 중복 등록 확인
    const existingRegistration = await Registration.findOne({
      where: {
        competition_id,
        user_id,
      },
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: '이미 이 대회에 등록되어 있습니다.',
      });
    }

    // 등록 생성 (훅에서 유효성 검사 및 참가비 계산)
    const registration = await Registration.create({
      competition_id,
      user_id,
      selected_events,
      total_fee: 0, // 훅에서 계산됨
    });

    // 관련 정보와 함께 조회
    const registrationWithDetails = await Registration.findByPk(registration.id, {
      include: [
        {
          model: Competition,
          as: 'Competition',
          attributes: ['id', 'name', 'date', 'location'],
        },
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'username'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: '대회 등록이 완료되었습니다.',
      data: registrationWithDetails,
    });
  } catch (error: any) {
    console.error('대회 등록 오류:', error);
    res.status(400).json({
      success: false,
      message: error.message || '대회 등록 중 오류가 발생했습니다.',
    });
  }
});

// 등록 목록 조회 (사용자별)
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const whereCondition: any = { user_id: userId };
    if (status && typeof status === 'string') {
      whereCondition.payment_status = status;
    }

    const registrations = await Registration.findAll({
      where: whereCondition,
      include: [
        {
          model: Competition,
          as: 'Competition',
          attributes: ['id', 'name', 'date', 'location', 'events'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error('등록 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '등록 목록 조회 중 오류가 발생했습니다.',
    });
  }
});

// 등록 목록 조회 (대회별)
router.get('/competition/:competitionId', async (req: Request, res: Response) => {
  try {
    const { competitionId } = req.params;
    const { status } = req.query;

    const whereCondition: any = { competition_id: competitionId };
    if (status && typeof status === 'string') {
      whereCondition.payment_status = status;
    }

    const registrations = await Registration.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'username'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error('대회별 등록 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '등록 목록 조회 중 오류가 발생했습니다.',
    });
  }
});

// 특정 등록 정보 조회
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const registration = await Registration.findByPk(id, {
      include: [
        {
          model: Competition,
          as: 'Competition',
          attributes: ['id', 'name', 'date', 'location', 'events', 'base_fee', 'event_fee'],
        },
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'username', 'email'],
        },
      ],
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: '등록 정보를 찾을 수 없습니다.',
      });
    }

    res.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error('등록 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '등록 정보 조회 중 오류가 발생했습니다.',
    });
  }
});

// 등록 정보 수정 (종목 변경)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { selected_events } = req.body;

    if (!selected_events || !Array.isArray(selected_events)) {
      return res.status(400).json({
        success: false,
        message: '유효한 종목 목록을 제공해주세요.',
      });
    }

    const registration = await Registration.findByPk(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: '등록 정보를 찾을 수 없습니다.',
      });
    }

    // 결제 완료된 등록은 수정 불가
    if (registration.payment_status === 'paid') {
      return res.status(400).json({
        success: false,
        message: '결제 완료된 등록은 수정할 수 없습니다.',
      });
    }

    // 종목 변경 (훅에서 참가비 재계산)
    await registration.update({ selected_events });

    const updatedRegistration = await Registration.findByPk(id, {
      include: [
        {
          model: Competition,
          as: 'Competition',
          attributes: ['id', 'name', 'date', 'location'],
        },
      ],
    });

    res.json({
      success: true,
      message: '등록 정보가 수정되었습니다.',
      data: updatedRegistration,
    });
  } catch (error: any) {
    console.error('등록 정보 수정 오류:', error);
    res.status(400).json({
      success: false,
      message: error.message || '등록 정보 수정 중 오류가 발생했습니다.',
    });
  }
});

// 결제 상태 변경
router.patch('/:id/payment-status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'paid', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 결제 상태입니다.',
      });
    }

    const registration = await Registration.findByPk(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: '등록 정보를 찾을 수 없습니다.',
      });
    }

    await registration.updatePaymentStatus(status);

    res.json({
      success: true,
      message: '결제 상태가 변경되었습니다.',
      data: {
        id: registration.id,
        payment_status: registration.payment_status,
      },
    });
  } catch (error) {
    console.error('결제 상태 변경 오류:', error);
    res.status(500).json({
      success: false,
      message: '결제 상태 변경 중 오류가 발생했습니다.',
    });
  }
});

// 등록 취소 (삭제)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const registration = await Registration.findByPk(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: '등록 정보를 찾을 수 없습니다.',
      });
    }

    // 결제 완료된 등록은 삭제 불가
    if (registration.payment_status === 'paid') {
      return res.status(400).json({
        success: false,
        message: '결제 완료된 등록은 취소할 수 없습니다. 관리자에게 문의하세요.',
      });
    }

    await registration.destroy();

    res.json({
      success: true,
      message: '등록이 취소되었습니다.',
    });
  } catch (error) {
    console.error('등록 취소 오류:', error);
    res.status(500).json({
      success: false,
      message: '등록 취소 중 오류가 발생했습니다.',
    });
  }
});

export default router;
