 // State
        let academicHistory = JSON.parse(localStorage.getItem('cgpaHistory')) || [];

        // DOM Elements
        const courseContainer = document.getElementById('course-container');
        const historyList = document.getElementById('history-list');
        const totalCgpaEl = document.getElementById('total-cgpa');

        // Initialize
        function init() {
            renderHistory();
            updateCumulativeCGPA();
            // Add 3 default rows for convenience
            addNewCourseRow();
            addNewCourseRow();
            addNewCourseRow();
        }

        // 1. Add Dynamic Course Row
        function addNewCourseRow() {
            const div = document.createElement('div');
            div.className = 'course-row';
            div.innerHTML = `
                <input type="text" placeholder="Course Code (e.g. COS101)" class="course-name">
                <input type="number" placeholder="Units" class="course-unit" min="1" max="6">
                <select class="course-grade">
                    <option value="">Grade</option>
                    <option value="5">A (5)</option>
                    <option value="4">B (4)</option>
                    <option value="3">C (3)</option>
                    <option value="2">D (2)</option>
                    <option value="1">E (1)</option>
                    <option value="0">F (0)</option>
                </select>
                <i class="fas fa-times btn-remove" onclick="this.parentElement.remove()"></i>
            `;
            courseContainer.appendChild(div);
        }

        // 2. Calculate GPA & Save
        function calculateAndSave() {
            // Get Details
            const session = document.getElementById('session').value || 'Unknown Session';
            const level = document.getElementById('level').value;
            const semester = document.getElementById('semester').value;

            // Get Course Data
            const rows = document.querySelectorAll('.course-row');
            let totalUnits = 0;
            let totalPoints = 0;
            let courseCount = 0;

            rows.forEach(row => {
                const unit = parseFloat(row.querySelector('.course-unit').value);
                const grade = parseFloat(row.querySelector('.course-grade').value);

                if (!isNaN(unit) && !isNaN(grade)) {
                    totalUnits += unit;
                    totalPoints += (unit * grade);
                    courseCount++;
                }
            });

            if (courseCount === 0) return alert("Please enter at least one valid course with Units and Grade.");

            const gpa = (totalPoints / totalUnits).toFixed(2);

            // Create Object
            const newResult = {
                id: Date.now(),
                session,
                level,
                semester,
                totalUnits,
                totalPoints,
                gpa
            };

            // Save to History
            academicHistory.push(newResult);
            saveToLocal();
            
            // UI Updates
            renderHistory();
            updateCumulativeCGPA();
            
            // Clear inputs for next usage
            // document.getElementById('session').value = '';
            // Reset rows
            courseContainer.innerHTML = '';
            addNewCourseRow(); addNewCourseRow(); addNewCourseRow();
            
            alert(`GPA Calculated: ${gpa}`);
        }

        // 3. Render History List
        function renderHistory() {
            historyList.innerHTML = '';
            
            // Sort by newest first
            const sortedHistory = [...academicHistory].reverse();

            sortedHistory.forEach(item => {
                const div = document.createElement('div');
                div.className = 'result-card';
                div.innerHTML = `
                    <div class="result-info">
                        <h3>${item.level} Level - ${item.semester} Semester</h3>
                        <p>${item.session}</p>
                        <p style="font-size: 0.8rem; margin-top:5px;">Units: ${item.totalUnits} | Points: ${item.totalPoints}</p>
                    </div>
                    <div class="result-score">
                        <div class="gpa-badge">${item.gpa}</div>
                    </div>
                    <i class="fas fa-trash btn-delete-card" onclick="deleteItem(${item.id})"></i>
                `;
                historyList.appendChild(div);
            });
        }

        // 4. Update Global CGPA
        function updateCumulativeCGPA() {
            if (academicHistory.length === 0) {
                totalCgpaEl.innerText = "0.00";
                return;
            }

            let allPoints = 0;
            let allUnits = 0;

            academicHistory.forEach(item => {
                allPoints += item.totalPoints;
                allUnits += item.totalUnits;
            });

            const cgpa = (allPoints / allUnits).toFixed(2);
            totalCgpaEl.innerText = cgpa;
        }

        // 5. Delete Item
        function deleteItem(id) {
            if(confirm('Delete this result?')) {
                academicHistory = academicHistory.filter(item => item.id !== id);
                saveToLocal();
                renderHistory();
                updateCumulativeCGPA();
            }
        }

        // Helper: Save to LocalStorage
        function saveToLocal() {
            localStorage.setItem('cgpaHistory', JSON.stringify(academicHistory));
        }

        // Run
        init();
