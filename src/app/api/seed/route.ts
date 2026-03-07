import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, generateVerificationToken } from "@/lib/crypto";

export async function GET() {
  try {
    // Check if already seeded
    const existingUsers = await db.user.count();
    if (existingUsers > 0) {
      return NextResponse.json({ message: "Database already seeded" });
    }

    // Create verified admin user
    const adminPassword = hashPassword("imthedeveloper");
    const admin = await db.user.create({
      data: {
        name: "Hari Baik",
        email: "hari.baik202@gmail.com",
        password: adminPassword,
        role: "ADMIN",
        emailVerified: true,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=haribaik",
      },
    });

    // Create verified admin/designer user
    const designerPassword = hashPassword("imthedesigner");
    const designer = await db.user.create({
      data: {
        name: "Web Developer",
        email: "web73dev@gmail.com",
        password: designerPassword,
        role: "ADMIN",
        emailVerified: true,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=web73dev",
      },
    });

    // Create sample member (unverified for demo)
    const memberToken = generateVerificationToken();
    const memberPassword = hashPassword("member123");
    const member = await db.user.create({
      data: {
        name: "Demo Member",
        email: "member@class.com",
        password: memberPassword,
        role: "MEMBER",
        emailVerified: false,
        verificationToken: memberToken,
        tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=member",
      },
    });

    // Create students - Class 7.3
    const studentData = [
      { name: "Ahmad Fakih Alkhoir", gender: "Male" },
      { name: "Alif Rafandra Isrian", gender: "Male" },
      { name: "Andi Naidah Aksa", gender: "Female" },
      { name: "Anggia Meisya", gender: "Female" },
      { name: "Annisa Tri Wulandari", gender: "Female" },
      { name: "Aqila Ruzannah", gender: "Female" },
      { name: "Athaya Haruki Zhafran", gender: "Male" },
      { name: "Awra Dewi", gender: "Female" },
      { name: "Bintang Frizidan H F S", gender: "Male" },
      { name: "Boy Eins Alvian", gender: "Male" },
      { name: "Bunga Fatimah Damero H", gender: "Female" },
      { name: "Dino Abdul Rahmat", gender: "Male" },
      { name: "Diva Azzahra", gender: "Female" },
      { name: "Haikal Dwi Indriadi", gender: "Male" },
      { name: "Imam Fazil Alfarez", gender: "Male" },
      { name: "Jaya Yose Multi Arta", gender: "Male" },
      { name: "Keenan Yumaza Veda", gender: "Male" },
      { name: "Khalisa Aliya Winata", gender: "Female" },
      { name: "Khansa Alya Hasan", gender: "Female" },
      { name: "M Abid Muzakki", gender: "Male" },
      { name: "M. Eshan Arsyad", gender: "Male" },
      { name: "Nadia Zahra Arin", gender: "Female" },
      { name: "Nasywah Siti Raisah", gender: "Female" },
      { name: "Raffa Zaidan Awalia", gender: "Male" },
      { name: "T. Nurul Assyifa", gender: "Female" },
      { name: "Talitha Aqilah Maheswari", gender: "Female" },
      { name: "Zahra Juneeta Arna", gender: "Female" },
      { name: "Aliyah", gender: "Female" },
    ];
    const students = await Promise.all(
      studentData.map((s, i) =>
        db.student.create({
          data: {
            name: s.name,
            studentId: `STU${String(i + 1).padStart(3, "0")}`,
            className: "7.3",
            gender: s.gender,
            status: "active",
          },
        })
      )
    );

    // Create schedules
    const schedules = await Promise.all([
      db.schedule.create({
        data: {
          title: "Mathematics",
          subject: "Mathematics",
          day: "Monday",
          startTime: "08:00",
          endTime: "09:30",
          room: "Room 101",
          teacherName: "Dr. Smith",
          color: "#ef4444",
        },
      }),
      db.schedule.create({
        data: {
          title: "Physics",
          subject: "Physics",
          day: "Monday",
          startTime: "10:00",
          endTime: "11:30",
          room: "Lab 201",
          teacherName: "Prof. Johnson",
          color: "#22c55e",
        },
      }),
      db.schedule.create({
        data: {
          title: "English Literature",
          subject: "English",
          day: "Tuesday",
          startTime: "08:00",
          endTime: "09:30",
          room: "Room 102",
          teacherName: "Ms. Williams",
          color: "#3b82f6",
        },
      }),
      db.schedule.create({
        data: {
          title: "Chemistry",
          subject: "Chemistry",
          day: "Tuesday",
          startTime: "10:00",
          endTime: "11:30",
          room: "Lab 202",
          teacherName: "Dr. Brown",
          color: "#f59e0b",
        },
      }),
      db.schedule.create({
        data: {
          title: "Computer Science",
          subject: "Computer Science",
          day: "Wednesday",
          startTime: "08:00",
          endTime: "09:30",
          room: "Computer Lab",
          teacherName: "Mr. Davis",
          color: "#8b5cf6",
        },
      }),
      db.schedule.create({
        data: {
          title: "History",
          subject: "History",
          day: "Wednesday",
          startTime: "10:00",
          endTime: "11:30",
          room: "Room 103",
          teacherName: "Mrs. Taylor",
          color: "#ec4899",
        },
      }),
      db.schedule.create({
        data: {
          title: "Biology",
          subject: "Biology",
          day: "Thursday",
          startTime: "08:00",
          endTime: "09:30",
          room: "Lab 203",
          teacherName: "Dr. Wilson",
          color: "#14b8a6",
        },
      }),
      db.schedule.create({
        data: {
          title: "Art & Design",
          subject: "Art",
          day: "Friday",
          startTime: "08:00",
          endTime: "10:00",
          room: "Art Studio",
          teacherName: "Ms. Anderson",
          color: "#f97316",
        },
      }),
    ]);

    // Create announcements
    const announcements = await Promise.all([
      db.announcement.create({
        data: {
          title: "Welcome to Class 7.3",
          content:
            "Welcome to the Class 7.3 website! This platform helps students, teachers, and administrators stay connected and organized. Explore all features and contact us if you have any questions.",
          priority: "high",
          isPinned: true,
          authorId: admin.id,
        },
      }),
      db.announcement.create({
        data: {
          title: "Mid-Term Examination Schedule",
          content:
            "Mid-term examinations will be held from March 15th to March 22nd. Check the schedule section for detailed timing. Arrive 15 minutes before the scheduled time.",
          priority: "high",
          isPinned: true,
          authorId: admin.id,
        },
      }),
      db.announcement.create({
        data: {
          title: "Parent-Teacher Meeting",
          content:
            "Parent-teacher meeting is scheduled for Saturday, March 25th from 9:00 AM to 1:00 PM. Parents are requested to attend to discuss their child's progress.",
          priority: "normal",
          isPinned: false,
          authorId: designer.id,
        },
      }),
      db.announcement.create({
        data: {
          title: "Science Fair Registration Open",
          content:
            "Registration for the annual science fair is now open! Students from all classes are encouraged to participate. The fair will be held on April 10th.",
          priority: "normal",
          isPinned: false,
          authorId: admin.id,
        },
      }),
    ]);

    // Create teachers
    const teachers = await Promise.all([
      db.teacher.create({
        data: {
          name: "Dr. Robert Smith",
          email: "r.smith@school.edu",
          phone: "+1 234-567-1001",
          subject: "Mathematics",
          position: "Head of Mathematics Department",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rsmith",
          bio: "Ph.D. in Applied Mathematics from MIT. 15 years of teaching experience. Specializes in calculus and linear algebra.",
        },
      }),
      db.teacher.create({
        data: {
          name: "Prof. Sarah Johnson",
          email: "s.johnson@school.edu",
          phone: "+1 234-567-1002",
          subject: "Physics",
          position: "Senior Physics Teacher",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sjohnson",
          bio: "M.Sc. in Physics from Stanford. 12 years of teaching experience. Passionate about making physics accessible to all students.",
        },
      }),
      db.teacher.create({
        data: {
          name: "Ms. Emily Williams",
          email: "e.williams@school.edu",
          phone: "+1 234-567-1003",
          subject: "English Literature",
          position: "English Department Head",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ewilliams",
          bio: "M.A. in English Literature from Oxford. 10 years of teaching experience. Published author of two poetry collections.",
        },
      }),
      db.teacher.create({
        data: {
          name: "Dr. Michael Brown",
          email: "m.brown@school.edu",
          phone: "+1 234-567-1004",
          subject: "Chemistry",
          position: "Chemistry Teacher",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mbrown",
          bio: "Ph.D. in Organic Chemistry from Caltech. 8 years of teaching experience. Research focus on sustainable chemistry.",
        },
      }),
      db.teacher.create({
        data: {
          name: "Mr. David Davis",
          email: "d.davis@school.edu",
          phone: "+1 234-567-1005",
          subject: "Computer Science",
          position: "Technology Coordinator",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ddavis",
          bio: "M.S. in Computer Science from Carnegie Mellon. 6 years of teaching experience. Former software engineer at Google.",
        },
      }),
      db.teacher.create({
        data: {
          name: "Mrs. Jennifer Taylor",
          email: "j.taylor@school.edu",
          phone: "+1 234-567-1006",
          subject: "History",
          position: "Social Studies Teacher",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jtaylor",
          bio: "M.A. in History from Yale. 14 years of teaching experience. Specializes in American and World History.",
        },
      }),
    ]);

    // Create class structure
    const structures = await Promise.all([
      db.classStructure.create({
        data: {
          name: "School Administration",
          position: "Administration",
          description: "Overall management and leadership of the school",
          order: 1,
        },
      }),
      db.classStructure.create({
        data: {
          name: "Principal",
          position: "Head of School",
          description:
            "Chief administrative officer responsible for all school operations",
          order: 2,
        },
      }),
      db.classStructure.create({
        data: {
          name: "Vice Principal",
          position: "Academic Affairs",
          description: "Oversees curriculum and academic programs",
          order: 3,
        },
      }),
      db.classStructure.create({
        data: {
          name: "Academic Departments",
          position: "Department Heads",
          description: "Leaders of various academic departments",
          order: 4,
        },
      }),
      db.classStructure.create({
        data: {
          name: "Teaching Staff",
          position: "Teachers",
          description: "Dedicated educators for all subjects",
          order: 5,
        },
      }),
      db.classStructure.create({
        data: {
          name: "Student Council",
          position: "Student Leadership",
          description: "Elected student representatives",
          order: 6,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Database seeded successfully",
      data: {
        users: {
          admin1: { email: admin.email, role: admin.role },
          admin2: { email: designer.email, role: designer.role },
          member: { email: member.email, verified: false },
        },
        students: students.length,
        schedules: schedules.length,
        announcements: announcements.length,
        teachers: teachers.length,
        structures: structures.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
