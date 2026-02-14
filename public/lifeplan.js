/* --- DATA STRUCTURE --- */
        const defaultData = {
            vision: "",
            goals: {
                career: [],
                wealth: [],
                health: [],
                relationships: []
            }
        };

        // Load data from LocalStorage or use default
        let appData = JSON.parse(localStorage.getItem('lifePlanDB')) || defaultData;

        /* --- DOM ELEMENTS --- */
        const visionInput = document.getElementById('vision-statement');
        const visionStatus = document.getElementById('vision-status');

        /* --- INITIALIZATION --- */
        function init() {
            // 1. Load Vision
            visionInput.value = appData.vision;
            
            // 2. Load Goals for each pillar
            renderGoals('career');
            renderGoals('wealth');
            renderGoals('health');
            renderGoals('relationships');
        }

        /* --- VISION BOARD LOGIC --- */
        visionInput.addEventListener('input', () => {
            appData.vision = visionInput.value;
            saveData();
            showSaveStatus();
        });

        function showSaveStatus() {
            visionStatus.style.opacity = '1';
            visionStatus.innerText = "Saving...";
            setTimeout(() => {
                visionStatus.innerText = "Saved to Database";
                setTimeout(() => { visionStatus.style.opacity = '0'; }, 2000);
            }, 500);
        }

        /* --- GOAL LOGIC --- */
        function addGoal(category) {
            const input = document.getElementById(`input-${category}`);
            const dateInput = document.getElementById(`date-${category}`);
            const text = input.value.trim();
            const date = dateInput.value;

            if (text === "") return alert("Please write a goal first!");

            const newGoal = {
                id: Date.now(), // Unique ID based on time
                text: text,
                date: date || "No Deadline",
                completed: false
            };

            // Add to data object
            appData.goals[category].push(newGoal);
            
            // Clear inputs
            input.value = "";
            dateInput.value = "";

            // Save and Render
            saveData();
            renderGoals(category);
        }

        function deleteGoal(category, id) {
            // Filter out the goal with the specific ID
            appData.goals[category] = appData.goals[category].filter(goal => goal.id !== id);
            saveData();
            renderGoals(category);
        }

        function toggleComplete(category, id) {
            // Find the goal and flip its completed status
            const goal = appData.goals[category].find(g => g.id === id);
            if (goal) {
                goal.completed = !goal.completed;
                saveData();
                renderGoals(category);
            }
        }

        function renderGoals(category) {
            const listElement = document.getElementById(`list-${category}`);
            listElement.innerHTML = ""; // Clear current list

            appData.goals[category].forEach(goal => {
                const li = document.createElement('li');
                li.className = `goal-item ${goal.completed ? 'completed' : ''}`;
                
                li.innerHTML = `
                    <div class="checkbox" onclick="toggleComplete('${category}', ${goal.id})"></div>
                    <div class="goal-details">
                        <span>${goal.text}</span>
                        <span class="goal-date"><i class="far fa-clock"></i> ${goal.date}</span>
                    </div>
                    <i class="fas fa-trash delete-btn" onclick="deleteGoal('${category}', ${goal.id})"></i>
                `;

                listElement.appendChild(li);
            });
        }

        /* --- PERSISTENCE (DATABASE) --- */
        function saveData() {
            localStorage.setItem('lifePlanDB', JSON.stringify(appData));
        }

        // Start the app
        init();