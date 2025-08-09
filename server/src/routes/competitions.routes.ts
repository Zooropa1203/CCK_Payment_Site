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

export default router;
