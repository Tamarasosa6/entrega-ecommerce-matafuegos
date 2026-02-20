class UserRepository {
    constructor(dao) { this.dao = dao; }
    getUserByEmail(email) { return this.dao.getByEmail(email); }
    getUserById(id) { return this.dao.getById(id); }
    createUser(data) { return this.dao.create(data); }
    updateUser(id, data) { return this.dao.update(id, data); }
}

module.exports = UserRepository;
