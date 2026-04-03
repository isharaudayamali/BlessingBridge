const Member = require('../models/Member');

const buildName = (firstName, lastName, fallbackName = '') => {
    const combinedName = `${firstName || ''} ${lastName || ''}`.trim();
    return combinedName || fallbackName || '';
};

const normalizeText = (value) => {
    if (typeof value !== 'string') {
        return value;
    }
    const trimmed = value.trim();
    return trimmed || undefined;
};

const normalizeGender = (value) => {
    const normalized = normalizeText(value);
    if (!normalized) {
        return undefined;
    }

    const lower = normalized.toLowerCase();
    if (lower === 'male') return 'Male';
    if (lower === 'female') return 'Female';
    return null;
};

const splitName = (fullName) => {
    const normalized = normalizeText(fullName);
    if (!normalized) {
        return { firstName: undefined, lastName: undefined };
    }

    const [firstName = '', ...lastNameParts] = normalized.split(/\s+/);
    return {
        firstName: firstName || undefined,
        lastName: lastNameParts.join(' ') || undefined
    };
};

const cleanUndefinedFields = (payload) => {
    return Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
    );
};

const normalizeDateInput = (value) => {
    if (value === undefined) return { value: undefined, error: null };
    if (value === null || value === '') return { value: null, error: null };

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
        return { value: undefined, error: 'Invalid date format' };
    }

    return { value: parsedDate, error: null };
};

// 1. Add Member
const createMember = async (req, res) => {
    const {
        firstName,
        lastName,
        familyName,
        email,
        name,
        dob,
        birthday,
        gender,
        anniversary,
        spouse,
        phone,
        category
    } = req.body;

    const normalizedName = buildName(firstName, lastName, name);
    const normalizedGender = normalizeGender(gender);
    const parsedDob = normalizeDateInput(dob ?? birthday);
    const parsedAnniversary = normalizeDateInput(anniversary);

    if (gender !== undefined && normalizedGender === null) {
        return res.status(400).json({ message: 'Gender must be Male or Female' });
    }

    if (!normalizedName) {
        return res.status(400).json({ message: 'Member name is required' });
    }

    if (parsedDob.error || !parsedDob.value) {
        return res.status(400).json({ message: 'Date of birth is required' });
    }

    if (parsedAnniversary.error) {
        return res.status(400).json({ message: 'Invalid anniversary date format' });
    }

    try {
        const memberPayload = cleanUndefinedFields({
            firstName,
            lastName,
            familyName: normalizeText(familyName),
            name: normalizedName,
            email: normalizeText(email),
            dob: parsedDob.value,
            gender: normalizedGender,
            anniversary: parsedAnniversary.value,
            spouse,
            phone: normalizeText(phone),
            category
        });

        const member = new Member(memberPayload);
        const savedMember = await member.save();

        // Spouse field 
        if (spouse) {
            await Member.findByIdAndUpdate(spouse, { 
                spouse: savedMember._id,
                anniversary: anniversary // Wedding date is same
            });
        }

        res.status(201).json({
            message: 'Member added successfully',
            member: savedMember
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(400).json({ message: error.message });
    }
};

// 2. Get All Members- List of all members with spouse details
const getAllMembers = async (req, res) => {
    try {
        const members = await Member.find().populate('spouse', 'name');
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get member by id
const getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id).populate('spouse', 'name');
        if (!member) return res.status(404).json({ message: 'Member not found' });
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//search member by name
const searchMembersByName = async (req, res) => {
    try {
        const query = (req.query.name || req.query.q || '').trim();

        let filter = {};
        if (query) {
            const terms = query
                .split(/\s+/)
                .map((term) => term.trim())
                .filter(Boolean)
                .map((term) => new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));

            filter = {
                $and: terms.map((termRegex) => ({
                    $or: [
                        { name: termRegex },
                        { firstName: termRegex },
                        { lastName: termRegex },
                        { familyName: termRegex }
                    ]
                }))
            };
        }

        const members = await Member.find(filter)
            .sort({ updatedAt: -1 })
            .populate('spouse', 'name');

        res.json({ count: members.length, members });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update member
const updateMember = async (req, res) => {
    try {
        const incoming = { ...req.body };
        const knownFields = new Set([
            'name',
            'firstName',
            'lastName',
            'familyName',
            'email',
            'phone',
            'gender',
            'dob',
            'birthday',
            'anniversary',
            'spouse',
            'category'
        ]);

        const extraFields = Object.fromEntries(
            Object.entries(incoming).filter(([key, value]) => !knownFields.has(key) && value !== undefined)
        );

        const parsedDob = normalizeDateInput(incoming.dob ?? incoming.birthday);
        if (parsedDob.error) {
            return res.status(400).json({ message: 'Invalid date of birth format' });
        }

        const parsedAnniversary = normalizeDateInput(incoming.anniversary);
        if (parsedAnniversary.error) {
            return res.status(400).json({ message: 'Invalid anniversary date format' });
        }

        const payload = {
            name: normalizeText(incoming.name),
            firstName: normalizeText(incoming.firstName),
            lastName: normalizeText(incoming.lastName),
            familyName: normalizeText(incoming.familyName),
            email: normalizeText(incoming.email),
            phone: normalizeText(incoming.phone),
            gender: normalizeGender(incoming.gender),
            dob: parsedDob.value,
            anniversary: parsedAnniversary.value,
            spouse: incoming.spouse,
            category: normalizeText(incoming.category)
        };

        if (incoming.gender !== undefined && payload.gender === null) {
            return res.status(400).json({ message: 'Gender must be Male or Female' });
        }

        if (payload.name && !payload.firstName && !payload.lastName) {
            const { firstName, lastName } = splitName(payload.name);
            payload.firstName = firstName;
            payload.lastName = lastName;
        }

        if (payload.firstName || payload.lastName || payload.name) {
            payload.name = buildName(payload.firstName, payload.lastName, payload.name);

            if (!payload.name) {
                return res.status(400).json({ message: 'Member name is required' });
            }
        }

        const cleanedPayload = cleanUndefinedFields({ ...payload, ...extraFields });

        if (Object.keys(cleanedPayload).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update' });
        }

        const member = await Member.findByIdAndUpdate(
            req.params.id,
            cleanedPayload,
            { new: true, runValidators: true }
        ).populate('spouse', 'name');

        if (!member) return res.status(404).json({ message: 'Member not found' });

        res.json({
            message: 'Member updated successfully',
            member
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(400).json({ message: error.message });
    }
};

//delete member
const deleteMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        const member = await Member.findByIdAndDelete(memberId);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        await Member.updateMany(
            { spouse: memberId },
            { $set: { spouse: null, anniversary: null } }
        );

        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get Weekly Blessings - Birthday saha Anniversary list eka
const getWeeklyBlessings = async (req, res) => {
    try {
        const today = new Date();
        const lastMonday = new Date(today);
        lastMonday.setDate(today.getDate() - 6); // Giya Monday indan

        const members = await Member.find().populate('spouse', 'name');

        const blessings = members.filter(m => {
            const bDay = new Date(m.dob);
            const aDay = m.anniversary ? new Date(m.anniversary) : null;

            // Date match wenawada kiyala check karana helper function
            const isWithinWeek = (date) => {
                const dayMonth = (d) => `${d.getMonth() + 1}-${d.getDate()}`;
                
                // Meke logic eka: Me awrudde eka dawasata date eka convert karala range eka balanawa
                for (let i = 0; i <= 6; i++) {
                    let checkDate = new Date(lastMonday);
                    checkDate.setDate(lastMonday.getDate() + i);
                    if (dayMonth(date) === dayMonth(checkDate)) return true;
                }
                return false;
            };

            return isWithinWeek(bDay) || (aDay && isWithinWeek(aDay));
        });

        res.json({ blessings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createMember,
    getAllMembers,
    getWeeklyBlessings,
    getMemberById,
    searchMembersByName,
    updateMember,
    deleteMember
};
