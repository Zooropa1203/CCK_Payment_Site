import { Router } from 'express';
import type { Request, Response } from 'express';
import { Competition, Registration, User } from '../models/index.js';
import { Op } from 'sequelize';

const router = Router();

// 모든 대회 목록 조회 (메인 페이지용)
router.get('/', async (req: Request, res: Response) => {
  try {
    const competitions = await Competition.findAll({
      order: [['date', 'ASC']],
      include: [
        {
          model: Registration,
          as: 'registrations',
          attributes: ['id', 'payment_status'],
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    const competitionsWithStats = competitions.map(competition => {
      const registrations = competition.get('registrations') as any[] || [];
      const totalRegistrations = registrations.length;
      const paidRegistrations = registrations.filter(reg => reg.payment_status === 'paid').length;

      return {
        ...competition.toJSON(),
        stats: {
          totalRegistrations,
          paidRegistrations,
          isRegistrationOpen: competition.isRegistrationOpen(),
        },
      };
    });

    res.json({
      success: true,
      data: competitionsWithStats,
    });
  } catch (error) {
    console.error('대회 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '대회 목록을 조회하는 중 오류가 발생했습니다.',
    });
  }
});

// 특정 대회 상세 조회
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const competition = await Competition.findByPk(id, {
      include: [
        {
          model: Registration,
          as: 'registrations',
          attributes: ['id', 'selected_events', 'total_fee', 'payment_status', 'createdAt'],
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['id', 'name', 'username'],
            },
          ],
        },
      ],
    });

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: '대회를 찾을 수 없습니다.',
      });
    }

    const registrations = competition.get('registrations') as any[] || [];
    const stats = {
      totalRegistrations: registrations.length,
      paidRegistrations: registrations.filter(reg => reg.payment_status === 'paid').length,
      pendingRegistrations: registrations.filter(reg => reg.payment_status === 'pending').length,
      cancelledRegistrations: registrations.filter(reg => reg.payment_status === 'cancelled').length,
      isRegistrationOpen: competition.isRegistrationOpen(),
      totalRevenue: registrations
        .filter(reg => reg.payment_status === 'paid')
        .reduce((sum, reg) => sum + reg.total_fee, 0),
    };

    res.json({
      success: true,
      data: {
        ...competition.toJSON(),
        stats,
      },
    });
  } catch (error) {
    console.error('대회 상세 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '대회 정보를 조회하는 중 오류가 발생했습니다.',
    });
  }
});

// 대회 생성 (관리자용)
router.post('/', async (req: Request, res: Response) => {
  try {
    const competitionData = req.body;
    
    const competition = await Competition.create(competitionData);
    
    res.status(201).json({
      success: true,
      message: '대회가 성공적으로 생성되었습니다.',
      data: competition,
    });
  } catch (error: any) {
    console.error('대회 생성 오류:', error);
    res.status(400).json({
      success: false,
      message: error.message || '대회 생성 중 오류가 발생했습니다.',
    });
  }
});

// 대회 정보 수정 (관리자용)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const competition = await Competition.findByPk(id);
    if (!competition) {
      return res.status(404).json({
        success: false,
        message: '대회를 찾을 수 없습니다.',
      });
    }
    
    await competition.update(updateData);
    
    res.json({
      success: true,
      message: '대회 정보가 성공적으로 수정되었습니다.',
      data: competition,
    });
  } catch (error: any) {
    console.error('대회 수정 오류:', error);
    res.status(400).json({
      success: false,
      message: error.message || '대회 정보 수정 중 오류가 발생했습니다.',
    });
  }
});

// 대회 삭제 (관리자용)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const competition = await Competition.findByPk(id);
    if (!competition) {
      return res.status(404).json({
        success: false,
        message: '대회를 찾을 수 없습니다.',
      });
    }
    
    // 등록자가 있는지 확인
    const registrationCount = await Registration.count({
      where: { competition_id: id },
    });
    
    if (registrationCount > 0) {
      return res.status(400).json({
        success: false,
        message: '등록자가 있는 대회는 삭제할 수 없습니다.',
      });
    }
    
    await competition.destroy();
    
    res.json({
      success: true,
      message: '대회가 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('대회 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '대회 삭제 중 오류가 발생했습니다.',
    });
  }
});

// 대회 스케줄 조회
router.get('/:id/schedule', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 실제로는 별도의 Schedule 모델이 있어야 하지만, 
    // 현재는 더미 데이터로 대응
    const scheduleData = [
      {
        time: '09:00',
        round: '1라운드',
        event: '3x3',
        group: 'A그룹',
        note: '예선'
      },
      {
        time: '10:30',
        round: '1라운드',
        event: '4x4',
        group: 'A그룹',
        note: '예선'
      },
      {
        time: '14:00',
        round: '결승',
        event: '3x3',
        group: '전체',
        note: '결승전'
      }
    ];
    
    res.json(scheduleData);
  } catch (error) {
    console.error('스케줄 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '스케줄 조회 중 오류가 발생했습니다.',
    });
  }
});

// 대회 참가자 목록 조회
router.get('/:id/participants', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const registrations = await Registration.findAll({
      where: { 
        competition_id: id,
        payment_status: 'paid' // 결제 완료된 참가자만
      },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    const participants = registrations.map(reg => ({
      id: reg.get('User')?.id,
      name: reg.get('User')?.name,
      events: reg.selected_events,
      paid: reg.payment_status === 'paid',
      total_fee: reg.total_fee,
    }));

    res.json(participants);
  } catch (error) {
    console.error('참가자 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '참가자 목록 조회 중 오류가 발생했습니다.',
    });
  }
});

// 대회 대기자 목록 조회
router.get('/:id/waitlist', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const registrations = await Registration.findAll({
      where: { 
        competition_id: id,
        payment_status: 'pending' // 결제 대기 중인 참가자
      },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    const waitlist = registrations.map(reg => ({
      id: reg.get('User')?.id,
      name: reg.get('User')?.name,
      events: reg.selected_events,
      registered_at: reg.createdAt,
    }));

    res.json(waitlist);
  } catch (error) {
    console.error('대기자 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '대기자 목록 조회 중 오류가 발생했습니다.',
    });
  }
});

export default router;
