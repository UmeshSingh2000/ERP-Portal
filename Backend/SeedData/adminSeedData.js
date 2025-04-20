const admin = require('../Schema/adminSchema')
const seedAdminData = async () => {
    try {
        const isAdmin = await admin.exists({ email: "umeshsinghmehta4@gmail.com" })
        if (isAdmin) {
            console.log("Admin already exists")
            return
        }
        const adminData = new admin({
            fullName: "Umesh Singh Mehta",
            email: "umeshsinghmehta4@gmail.com",
            password: "$2b$10$gJnurDM7QakqjKRgWHMfdeRcJi3WUYt7EN2VYeWPxgzX3QBVS4X/C",
            phoneNumber: "7351667526",
            role: "admin"
        })
        await adminData.save()
        console.log("Admin data seeded successfully")
    }
    catch (err) {

    }
}
module.exports = seedAdminData