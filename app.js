/* =========================================
   QALIN SCHOOL APP
   SUPABASE VERSION
========================================= */


/* =========================================
   SUPABASE
========================================= */

const SUPABASE_URL =
    "https://kxcgaywyarwfnsgifumr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_5ufiUbvnogUhEOv9JIxpjA_PCZrcjkL";


let supabaseClient = null;


function initSupabase() {

    if (window.supabase) {

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

    }

}


/* Load Supabase library */

(function loadSupabase() {

    const script =
        document.createElement("script");

    script.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

    script.onload = function () {

        initSupabase();

        startApp();

    };

    script.onerror = function () {

        console.error(
            "Supabase library lama soo dejin."
        );

    };

    document.head.appendChild(script);

})();


/* =========================================
   LANGUAGE
========================================= */

let language =
    localStorage.getItem("qalinLanguage") || "so";


function updateLanguage() {

    document.documentElement.lang =
        language;


    document
        .querySelectorAll("[data-so]")
        .forEach(element => {

            element.textContent =
                element.getAttribute(
                    language === "so"
                        ? "data-so"
                        : "data-en"
                );

        });


    const languageBtn =
        document.getElementById(
            "languageBtn"
        );


    if (languageBtn) {

        languageBtn.textContent =
            language === "so"
                ? "🇬🇧 English"
                : "🇸🇴 Somali";

    }

}


function changeLanguage() {

    language =
        language === "so"
            ? "en"
            : "so";


    localStorage.setItem(
        "qalinLanguage",
        language
    );


    updateLanguage();

}


/* =========================================
   MOBILE MENU
========================================= */

function toggleMenu() {

    const menu =
        document.getElementById(
            "mainMenu"
        );


    if (menu) {

        menu.classList.toggle(
            "open"
        );

    }

}


/* =========================================
   DARK MODE
========================================= */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const dark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "qalinTheme",
        dark
            ? "dark"
            : "light"
    );


    updateThemeButton();

}


function updateThemeButton() {

    const button =
        document.getElementById(
            "themeBtn"
        );


    if (!button) return;


    const dark =
        document.body.classList.contains(
            "dark"
        );


    button.textContent =
        dark
            ? "☀️"
            : "🌙";

}


function loadTheme() {

    const saved =
        localStorage.getItem(
            "qalinTheme"
        );


    if (saved === "dark") {

        document.body.classList.add(
            "dark"
        );

    }


    updateThemeButton();

}


/* =========================================
   ADMIN LOGIN - SUPABASE AUTH
========================================= */

function openAdminLogin() {

    const modal =
        document.getElementById(
            "adminModal"
        );


    if (!modal) return;


    modal.classList.add(
        "show"
    );


    const password =
        document.getElementById(
            "adminPassword"
        );


    if (password) {

        password.focus();

    }

}


function closeAdminLogin() {

    const modal =
        document.getElementById(
            "adminModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


async function adminLogin() {

    if (!supabaseClient) {

        alert(
            "Supabase wali lama diyaar."
        );

        return;

    }


    const passwordInput =
        document.getElementById(
            "adminPassword"
        );


    const message =
        document.getElementById(
            "loginMessage"
        );


    const email =
        prompt(
            "Geli Gmail-ka Admin-ka:"
        );


    if (!email) return;


    const password =
        passwordInput?.value.trim();


    if (!password) {

        if (message) {

            message.textContent =
                "❌ Geli password-ka.";

            message.style.color =
                "#ef4444";

        }

        return;

    }


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


    if (error) {

        if (message) {

            message.textContent =
                "❌ Gmail ama password waa khalad.";

            message.style.color =
                "#ef4444";

        }

        console.error(error);

        return;

    }


    if (data.session) {

        sessionStorage.setItem(
            "qalinAdmin",
            "true"
        );


        window.location.href =
            "admin.html";

    }

}


/* =========================================
   ADMIN LOGOUT
========================================= */

async function adminLogout() {

    if (supabaseClient) {

        await supabaseClient.auth.signOut();

    }


    sessionStorage.removeItem(
        "qalinAdmin"
    );


    window.location.href =
        "index.html";

}


/* =========================================
   ADMIN DASHBOARD MENU
========================================= */

function showDashboard(id) {

    document
        .querySelectorAll(
            ".dashboard-section"
        )
        .forEach(section => {

            section.classList.add(
                "hidden"
            );

        });


    const selected =
        document.getElementById(id);


    if (selected) {

        selected.classList.remove(
            "hidden"
        );

    }

}


/* =========================================
   STUDENT REGISTRATION
========================================= */

async function registerStudent() {

    if (!supabaseClient) {

        alert(
            "Supabase wali lama diyaar."
        );

        return;

    }


    const student = {

        name:
            document
            .getElementById(
                "studentName"
            )
            ?.value.trim(),

        phone:
            document
            .getElementById(
                "studentPhone"
            )
            ?.value.trim(),

        class:
            document
            .getElementById(
                "studentClass"
            )
            ?.value,

        gender:
            document
            .getElementById(
                "studentGender"
            )
            ?.value,

        address:
            document
            .getElementById(
                "studentAddress"
            )
            ?.value.trim() || ""

    };


    if (
        !student.name ||
        !student.phone ||
        !student.class ||
        !student.gender
    ) {

        alert(
            "Fadlan buuxi xogta muhiimka ah."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("students")
            .insert([student]);


    if (error) {

        console.error(error);

        alert(
            "❌ Ardayga lama kaydin. Hubi Supabase."
        );

        return;

    }


    alert(
        language === "so"
            ? "✅ Ardayga waa la diiwaangeliyey."
            : "✅ Student has been registered."
    );


    const form =
        document.getElementById(
            "studentForm"
        );


    if (form) {

        form.reset();

    }


    loadCounts();

}


/* =========================================
   STUDENT FORM
========================================= */

function setupStudentForm() {

    const form =
        document.getElementById(
            "studentForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            await registerStudent();

        }
    );

}


/* =========================================
   LOAD STUDENTS
========================================= */

async function getStudents() {

    if (!supabaseClient) return [];


    const { data, error } =
        await supabaseClient
            .from("students")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        return [];

    }


    return data || [];

}


/* =========================================
   LOAD TEACHERS
========================================= */

async function getTeachers() {

    if (!supabaseClient) return [];


    const { data, error } =
        await supabaseClient
            .from("teachers")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        return [];

    }


    return data || [];

}


/* =========================================
   LOAD COUNTS
========================================= */

async function loadCounts() {

    if (!supabaseClient) return;


    const students =
        await getStudents();


    const teachers =
        await getTeachers();


    const studentElements = [

        "studentCount",
        "statStudents",
        "adminStudentCount"

    ];


    studentElements.forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                students.length;

        }

    });


    const teacherElements = [

        "teacherCount",
        "statTeachers",
        "adminTeacherCount"

    ];


    teacherElements.forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                teachers.length;

        }

    });

}


/* =========================================
   LOAD STUDENTS ADMIN
========================================= */

async function loadStudentsAdmin() {

    const list =
        document.querySelector(
            "#studentsAdmin .admin-table"
        );


    if (!list) return;


    const students =
        await getStudents();


    if (!students.length) {

        list.innerHTML = `
            <div class="empty-admin">
                Weli ma jiraan arday la diiwaangeliyey.
            </div>
        `;

        return;

    }


    list.innerHTML = students.map(
        student => `

        <div class="admin-student-row">

            <strong>
                ${escapeHTML(student.name)}
            </strong>

            <span>
                📞 ${escapeHTML(student.phone)}
            </span>

            <span>
                📚 ${escapeHTML(student.class)}
            </span>

            <span>
                ${escapeHTML(student.gender)}
            </span>

            <span>
                📍 ${escapeHTML(student.address || "")}
            </span>

        </div>

        `
    ).join("");

}


/* =========================================
   SEARCH STUDENTS
========================================= */

async function searchStudents() {

    const input =
        document.getElementById(
            "studentSearch"
        );


    const list =
        document.getElementById(
            "studentsList"
        );


    if (!input || !list) return;


    const value =
        input.value
            .toLowerCase()
            .trim();


    const students =
        await getStudents();


    const results =
        students.filter(student =>
            student.name
                .toLowerCase()
                .includes(value)
        );


    if (!results.length) {

        list.innerHTML = `
            <div class="student-placeholder">
                👨‍🎓
                <h3>No student found</h3>
            </div>
        `;

        return;

    }


    list.innerHTML =
        results.map(
            student => `

            <div class="student-placeholder">

                👨‍🎓

                <h3>
                    ${escapeHTML(student.name)}
                </h3>

                <p>
                    Class:
                    ${escapeHTML(student.class)}
                </p>

                <p>
                    Gender:
                    ${escapeHTML(student.gender)}
                </p>

            </div>

            `
        ).join("");

}


/* =========================================
   ADD TEACHER
========================================= */

async function addTeacher() {

    if (!supabaseClient) {

        alert(
            "Supabase wali lama diyaar."
        );

        return;

    }


    const name =
        document.getElementById(
            "teacherName"
        )?.value.trim();


    const subject =
        document.getElementById(
            "teacherSubject"
        )?.value.trim();


    const phone =
        document.getElementById(
            "teacherPhone"
        )?.value.trim() || "";


    if (!name || !subject) {

        alert(
            "Geli magaca macallinka iyo maadada."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("teachers")
            .insert([{

                name,
                subject,
                phone

            }]);


    if (error) {

        console.error(error);

        alert(
            "❌ Macallinka lama kaydin."
        );

        return;

    }


    alert(
        "✅ Macallinka waa lagu daray."
    );


    document.getElementById(
        "teacherName"
    ).value = "";


    document.getElementById(
        "teacherSubject"
    ).value = "";


    document.getElementById(
        "teacherPhone"
    ).value = "";


    loadCounts();

    loadTeachers();

}


/* =========================================
   LOAD TEACHERS
========================================= */

async function loadTeachers() {

    const list =
        document.getElementById(
            "teachersList"
        );


    if (!list) return;


    const teachers =
        await getTeachers();


    if (!teachers.length) return;


    list.innerHTML =
        teachers.map(
            teacher => `

            <div class="teacher-card">

                <div class="teacher-avatar">
                    👨‍🏫
                </div>

                <h3>
                    ${escapeHTML(teacher.name)}
                </h3>

                <p>
                    ${escapeHTML(teacher.subject)}
                </p>

                ${
                    teacher.phone
                    ? `<p>📞 ${escapeHTML(teacher.phone)}</p>`
                    : ""
                }

            </div>

            `
        ).join("");

}


/* =========================================
   ANNOUNCEMENTS
========================================= */

async function addAnnouncement() {

    if (!supabaseClient) return;


    const title =
        document.getElementById(
            "announcementTitle"
        )?.value.trim();


    const text =
        document.getElementById(
            "announcementText"
        )?.value.trim();


    if (!title || !text) {

        alert(
            "Geli title iyo announcement."
        );

        return;

    }


    const { error } =
        await supabaseClient
            .from("announcements")
            .insert([{

                title,
                text

            }]);


    if (error) {

        console.error(error);

        alert(
            "❌ Announcement lama kaydin."
        );

        return;

    }


    alert(
        "✅ Announcement waa la kaydiyey."
    );


    document.getElementById(
        "announcementTitle"
    ).value = "";


    document.getElementById(
        "announcementText"
    ).value = "";

}


/* =========================================
   SCHOOL SETTINGS
========================================= */

async function saveSettings() {

    if (!supabaseClient) return;


    const phone =
        document.getElementById(
            "settingPhone"
        )?.value.trim() || "";


    const email =
        document.getElementById(
            "settingEmail"
        )?.value.trim() || "";


    const location =
        document.getElementById(
            "settingLocation"
        )?.value.trim() || "";


    const { data: existing } =
        await supabaseClient
            .from("school_settings")
            .select("id")
            .limit(1);


    let error;


    if (existing && existing.length) {

        const result =
            await supabaseClient
                .from("school_settings")
                .update({

                    phone,
                    email,
                    location,
                    updated_at:
                        new Date().toISOString()

                })
                .eq(
                    "id",
                    existing[0].id
                );


        error = result.error;

    } else {

        const result =
            await supabaseClient
                .from("school_settings")
                .insert([{

                    phone,
                    email,
                    location

                }]);


        error = result.error;

    }


    if (error) {

        console.error(error);

        alert(
            "❌ Settings lama kaydin."
        );

        return;

    }


    alert(
        "✅ School settings waa la kaydiyey."
    );

}


/* =========================================
   LOAD SCHOOL SETTINGS
========================================= */

async function loadSettings() {

    if (!supabaseClient) return;


    const { data, error } =
        await supabaseClient
            .from("school_settings")
            .select("*")
            .limit(1)
            .maybeSingle();


    if (error || !data) return;


    const phone =
        document.getElementById(
            "schoolPhone"
        );


    const email =
        document.getElementById(
            "schoolEmail"
        );


    const location =
        document.getElementById(
            "schoolLocation"
        );


    if (phone) {

        phone.textContent =
            data.phone || "Not set";

    }


    if (email) {

        email.textContent =
            data.email || "Not set";

    }


    if (location) {

        location.textContent =
            data.location || "Not set";

    }


    const settingPhone =
        document.getElementById(
            "settingPhone"
        );


    const settingEmail =
        document.getElementById(
            "settingEmail"
        );


    const settingLocation =
        document.getElementById(
            "settingLocation"
        );


    if (settingPhone)
        settingPhone.value =
            data.phone || "";


    if (settingEmail)
        settingEmail.value =
            data.email || "";


    if (settingLocation)
        settingLocation.value =
            data.location || "";

}


/* =========================================
   SECURITY HELPER
========================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   YEAR
========================================= */

function updateYear() {

    const year =
        document.getElementById(
            "year"
        );


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

}


/* =========================================
   START APP
========================================= */

async function startApp() {

    loadTheme();

    updateLanguage();

    updateYear();

    setupStudentForm();

    await loadCounts();

    await loadTeachers();

    await loadSettings();

    await loadStudentsAdmin();

}


/* =========================================
   DOM READY
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateYear();

    }
);