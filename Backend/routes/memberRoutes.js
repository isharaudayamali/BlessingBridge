const express = require('express');
const router = express.Router();

const {
    createMember,
    getAllMembers,
    getWeeklyBlessings,
    searchMembersByName,
    getMemberById,
    updateMember,
    deleteMember
} = require('../controllers/memberController');

// 1. Static Routes (මේවා මුලින්ම තියෙන්න ඕන)
router.post('/', createMember);
router.get('/', getAllMembers);
router.get('/weekly-blessings', getWeeklyBlessings); // මේක උඩට ගත්තා
router.get('/search', searchMembersByName);

// 2. Dynamic Routes (මේවා අන්තිමට තියෙන්න ඕන)
router.get('/:id', getMemberById);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

module.exports = router;