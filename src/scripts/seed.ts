import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';
import { Quiz } from '../entities/Quiz';
import { Question } from '../entities/Question';
import { Answer } from '../entities/Answer';
import bcrypt from 'bcryptjs';

const seedData = async () => {
    try {
        await AppDataSource.initialize();
        console.log("✅ Database connected!");

        const userRepository = AppDataSource.getRepository(User);
        const roleRepository = AppDataSource.getRepository(Role);
        const permissionRepository = AppDataSource.getRepository(Permission);
        const quizRepository = AppDataSource.getRepository(Quiz);
        const questionRepository = AppDataSource.getRepository(Question);
        const answerRepository = AppDataSource.getRepository(Answer);

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log("🗑️  Clearing existing data...");
        //await answerRepository.clear();
        //await questionRepository.clear();
        //await quizRepository.clear();
        //await userRepository.clear();
        //await roleRepository.clear();
        //await permissionRepository.clear();

        // Create permissions
        console.log("🔐 Creating permissions...");
        const permissions = [
            { name: 'Read Quiz', resource: 'quiz', action: 'read' },
            { name: 'Create Quiz', resource: 'quiz', action: 'create' },
            { name: 'Update Quiz', resource: 'quiz', action: 'update' },
            { name: 'Delete Quiz', resource: 'quiz', action: 'delete' },
            { name: 'Submit Quiz', resource: 'quiz', action: 'submit' },
            { name: 'Read Permission', resource: 'permission', action: 'read' },
            { name: 'Create Permission', resource: 'permission', action: 'create' },
            { name: 'Update Permission', resource: 'permission', action: 'update' },
            { name: 'Delete Permission', resource: 'permission', action: 'delete' },
            { name: 'Read Role', resource: 'role', action: 'read' },
            { name: 'Create Role', resource: 'role', action: 'create' },
            { name: 'Update Role', resource: 'role', action: 'update' },
            { name: 'Delete Role', resource: 'role', action: 'delete' },
            { name: 'Manage User', resource: 'user', action: 'manage' }
        ];

        const createdPermissions = [];
        for (const perm of permissions) {
            const permission = await permissionRepository.save(permissionRepository.create(perm));
            createdPermissions.push(permission);
            console.log(`  ✅ Created permission: ${permission.name}`);
        }

        // Create roles
        console.log("👥 Creating roles...");
        
        // Admin role (all permissions)
        const adminRole = await roleRepository.save(roleRepository.create({
            name: 'admin',
            description: 'Administrator with full access to all features',
            permissions: createdPermissions
        }));
        console.log("  ✅ Created admin role");

        // Moderator role (quiz management + read permissions)
        const moderatorPermissions = createdPermissions.filter(p => 
            p.resource === 'quiz' || 
            (p.resource === 'permission' && p.action === 'read') ||
            (p.resource === 'role' && p.action === 'read')
        );
        const moderatorRole = await roleRepository.save(roleRepository.create({
            name: 'moderator',
            description: 'Moderator with quiz management and read access',
            permissions: moderatorPermissions
        }));
        console.log("  ✅ Created moderator role");

        // User role (basic quiz access)
        const userPermissions = createdPermissions.filter(p => 
            p.resource === 'quiz' && ['read', 'submit'].includes(p.action)
        );
        const userRole = await roleRepository.save(roleRepository.create({
            name: 'user',
            description: 'Regular user with basic quiz access',
            permissions: userPermissions
        }));
        console.log("  ✅ Created user role");

        // Create users
        console.log("👤 Creating users...");
        
        // Admin user
        const adminPassword = await bcrypt.hash('admin123', 12);
        const adminUser = await userRepository.save(userRepository.create({
            username: 'admin',
            email: 'admin@example.com',
            password: adminPassword,
            roles: [adminRole]
        }));
        console.log("  ✅ Created admin user (admin/admin123)");

        // Moderator user
        const moderatorPassword = await bcrypt.hash('mod123', 12);
        const moderatorUser = await userRepository.save(userRepository.create({
            username: 'moderator',
            email: 'moderator@example.com',
            password: moderatorPassword,
            roles: [moderatorRole]
        }));
        console.log("  ✅ Created moderator user (moderator/mod123)");

        // Regular user
        const userPassword = await bcrypt.hash('user123', 12);
        const regularUser = await userRepository.save(userRepository.create({
            username: 'user',
            email: 'user@example.com',
            password: userPassword,
            roles: [userRole]
        }));
        console.log("  ✅ Created regular user (user/user123)");

        console.log("  ✅ Created TypeScript Fundamentals quiz");

        console.log("\n🎉 Seed data created successfully!");
        console.log("\n📋 Available users:");
        console.log("  ✅ Admin: admin/admin123 (Full access)");
        console.log("  ✅ Moderator: moderator/mod123 (Quiz management + read)");
        console.log("  ✅ User: user/user123 (Basic quiz access)");
        console.log("\n🔐 Permissions created:");
        console.log("  • Quiz: read, create, update, delete, submit");
        console.log("  • Permission: read, create, update, delete");
        console.log("  • Role: read, create, update, delete");
        console.log("  • User: manage");
        console.log("\n🚀 You can now test the API with these credentials!");

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await AppDataSource.destroy();
        process.exit(0);
    }
};

seedData();
