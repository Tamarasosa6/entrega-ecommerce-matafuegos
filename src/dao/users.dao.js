const User = require('../models/user.model');

class UserDAO {
    getByEmail(email) {
        return User.findOne({ email });
    }

    getById(id) {
        return User.findById(id);
    }

    create(data) {
        return User.create(data);
    }

    update(id, data) {
        return User.findByIdAndUpdate(id, data, { new: true });
    }
}

module.exports = UserDAO;
