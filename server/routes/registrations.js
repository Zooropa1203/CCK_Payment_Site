import { Router } from 'express';
import { Registration, Competition, User } from '../models/index.ts';
const router = Router();
// 대회 참가 신청
router.post('/', async (req, res) => {
    try {
        const { competition_id, user_id, selected_events } = req.body;
        // 필수 필드 검증
        if (!competition_id ||
            !user_id ||
            !selected_events ||
            !Array.isArray(selected_events) ||
            selected_events.length === 0) {
            return res.status(400).json({
                success: false,
                message: '필수 정보가 누락되었습니다.',
                required_fields: ['competition_id', 'user_id', 'selected_events'],
            });
        }
        // 대회 존재 여부 확인
        const competition = await Competition.findByPk(competition_id);
        if (!competition) {
            return res.status(404).json({
                success: false,
                message: '존재하지 않는 대회입니다.',
            });
        }
        // 사용자 존재 여부 확인
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '존재하지 않는 사용자입니다.',
            });
        }
        // 중복 신청 확인
        const existingRegistration = await Registration.findOne({
            where: {
                competition_id,
                user_id,
            },
        });
        if (existingRegistration) {
            return res.status(409).json({
                success: false,
                message: '이미 해당 대회에 참가 신청하셨습니다.',
                existing_registration: existingRegistration.id,
            });
        }
        // 선택한 종목이 대회에서 제공하는 종목인지 확인
        const invalidEvents = selected_events.filter(event => !competition.events.includes(event));
        if (invalidEvents.length > 0) {
            return res.status(400).json({
                success: false,
                message: '선택한 종목 중 일부가 해당 대회에서 제공되지 않습니다.',
                invalid_events: invalidEvents,
                available_events: competition.events,
            });
        }
        // 등록 기간 확인
        const now = new Date().toISOString().split('T')[0];
        if (now < competition.reg_start_date || now > competition.reg_end_date) {
            return res.status(400).json({
                success: false,
                message: '현재 등록 기간이 아닙니다.',
                registration_period: {
                    start: competition.reg_start_date,
                    end: competition.reg_end_date,
                    current: now,
                },
            });
        }
        // 참가비 계산
        const totalFee = Registration.calculateTotalFee(competition, selected_events);
        // 등록 생성
        const registration = await Registration.create({
            competition_id,
            user_id,
            selected_events,
            total_fee: totalFee,
            payment_status: 'pending',
        });
        // 생성된 등록 정보를 관련 데이터와 함께 조회
        const registrationWithDetails = await Registration.findByPk(registration.id, {
            include: [
                {
                    model: Competition,
                    as: 'competition',
                    attributes: ['id', 'name', 'date', 'location'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'username'],
                },
            ],
        });
        res.status(201).json({
            success: true,
            message: '대회 참가 신청이 완료되었습니다.',
            data: registrationWithDetails,
        });
    }
    catch (error) {
        console.error('대회 참가 신청 오류:', error);
        res.status(500).json({
            success: false,
            message: '대회 참가 신청 중 오류가 발생했습니다.',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
    }
});
// 특정 사용자의 참가 신청 목록
router.get('/user/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const { status } = req.query;
        let whereClause = { user_id };
        if (status && ['pending', 'paid', 'cancelled'].includes(status)) {
            whereClause.payment_status = status;
        }
        const registrations = await Registration.findAll({
            where: whereClause,
            include: [
                {
                    model: Competition,
                    as: 'competition',
                    attributes: [
                        'id',
                        'name',
                        'date',
                        'location',
                        'reg_start_date',
                        'reg_end_date',
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json({
            success: true,
            data: registrations,
            meta: {
                total: registrations.length,
                user_id: parseInt(user_id),
            },
        });
    }
    catch (error) {
        console.error('사용자 참가 신청 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '참가 신청 목록을 불러오는 중 오류가 발생했습니다.',
        });
    }
});
// 특정 대회의 참가자 목록
router.get('/competition/:competition_id', async (req, res) => {
    try {
        const { competition_id } = req.params;
        const { status } = req.query;
        let whereClause = { competition_id };
        if (status &&
            ['pending', 'paid', 'cancelled'].includes(status)) {
            whereClause.payment_status = status;
        }
        const registrations = await Registration.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'username'],
                },
            ],
            order: [['createdAt', 'ASC']],
        });
        // 종목별 참가자 통계
        const eventStats = {};
        registrations.forEach(reg => {
            reg.selected_events.forEach(event => {
                eventStats[event] = (eventStats[event] || 0) + 1;
            });
        });
        res.json({
            success: true,
            data: registrations,
            meta: {
                total: registrations.length,
                competition_id: parseInt(competition_id),
                event_stats: eventStats,
                status_stats: {
                    paid: registrations.filter(r => r.payment_status === 'paid').length,
                    pending: registrations.filter(r => r.payment_status === 'pending')
                        .length,
                    cancelled: registrations.filter(r => r.payment_status === 'cancelled').length,
                },
            },
        });
    }
    catch (error) {
        console.error('대회 참가자 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '참가자 목록을 불러오는 중 오류가 발생했습니다.',
        });
    }
});
// 특정 등록 정보 조회
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const registration = await Registration.findByPk(id, {
            include: [
                {
                    model: Competition,
                    as: 'competition',
                },
                {
                    model: User,
                    as: 'user',
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
    }
    catch (error) {
        console.error('등록 정보 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '등록 정보를 불러오는 중 오류가 발생했습니다.',
        });
    }
});
// 결제 상태 업데이트
router.patch('/:id/payment', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['paid', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: '유효하지 않은 결제 상태입니다.',
                valid_statuses: ['paid', 'cancelled'],
            });
        }
        const registration = await Registration.findByPk(id);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: '등록 정보를 찾을 수 없습니다.',
            });
        }
        if (status === 'paid') {
            await registration.markAsPaid();
        }
        else if (status === 'cancelled') {
            await registration.markAsCancelled();
        }
        res.json({
            success: true,
            message: `결제 상태가 '${status}'로 업데이트되었습니다.`,
            data: registration,
        });
    }
    catch (error) {
        console.error('결제 상태 업데이트 오류:', error);
        res.status(500).json({
            success: false,
            message: '결제 상태 업데이트 중 오류가 발생했습니다.',
        });
    }
});
// 등록 취소
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const registration = await Registration.findByPk(id);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: '등록 정보를 찾을 수 없습니다.',
            });
        }
        // 이미 결제 완료된 경우 취소 불가
        if (registration.payment_status === 'paid') {
            return res.status(400).json({
                success: false,
                message: '이미 결제 완료된 신청은 취소할 수 없습니다.',
            });
        }
        await registration.destroy();
        res.json({
            success: true,
            message: '참가 신청이 취소되었습니다.',
        });
    }
    catch (error) {
        console.error('등록 취소 오류:', error);
        res.status(500).json({
            success: false,
            message: '등록 취소 중 오류가 발생했습니다.',
        });
    }
});
export { router };
export default router;
//# sourceMappingURL=registrations.js.map