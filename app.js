// Performance Optimized JavaScript
'use strict';

// Cache DOM elements for better performance
const DOM = {
    currentTime: null,
    weekGrid: null,
    views: null,
    initialized: false
};

// Application state
const AppState = {
    currentView: 'week-overview',
    scheduleData: {
        monday: [
            { time: "05:30-06:30", activity: "🌅 Morgon Foundation", description: "Andlig reflektion, intention-setting för dagen" },
            { time: "06:30-07:30", activity: "📚 Deep Learning", description: "Focused study när mind är fresh" },
            { time: "07:30-09:00", activity: "👨‍👩‍👧‍👦 Familj & Prep", description: "Quality family time, breakfast" },
            { time: "09:00-12:00", activity: "🎯 High-Impact Work", description: "Most challenging tasks, peak cognitive hours" },
            { time: "12:00-13:00", activity: "🍽️ Mindful Lunch", description: "Nutritious meal, mental reset" },
            { time: "13:00-17:00", activity: "💼 Productive Flow", description: "Meetings, collaboration, admin" },
            { time: "17:00-19:00", activity: "👨‍👩‍👧‍👦 Family Priority", description: "Full presence med family, dinner" },
            { time: "19:00-20:30", activity: "📖 Personal Development", description: "Reading, reflection, skill-building" },
            { time: "20:30-22:00", activity: "🌙 Evening Wind-Down", description: "Family time, preparation för tomorrow" }
        ],
        tuesday: [
            { time: "05:30-06:30", activity: "💪 Power Morning", description: "Intensive workout, peak performance prep" },
            { time: "06:30-07:30", activity: "🧠 Strategic Thinking", description: "High-level planning, problem-solving" },
            { time: "07:30-09:00", activity: "👨‍👩‍👧‍👦 Family Connection", description: "Engaged family time, supportive send-off" },
            { time: "09:00-12:00", activity: "🚀 Peak Performance Work", description: "Most demanding projects, complex decisions" },
            { time: "12:00-13:00", activity: "⚡ Energy Restoration", description: "Nutritious meal, power nap/meditation" },
            { time: "13:00-17:00", activity: "🎯 Focused Execution", description: "Implementation, productive meetings" },
            { time: "17:00-19:00", activity: "👨‍👩‍👧‍👦 Family Excellence", description: "Quality time, engaging conversations" },
            { time: "19:00-20:30", activity: "📈 Skill Development", description: "Advanced learning, professional development" },
            { time: "20:30-22:00", activity: "🎯 Next-Day Prep", description: "Strategic planning för tomorrow" }
        ],
        wednesday: [
            { time: "05:30-06:30", activity: "⚖️ Balanced Morning", description: "Movement, meditation, balanced start" },
            { time: "06:30-07:30", activity: "🌱 Growth & Learning", description: "Sustainable learning approach" },
            { time: "07:30-09:00", activity: "👨‍👩‍👧‍👦 Nurturing Family Time", description: "Caring interactions, balanced attention" },
            { time: "09:00-12:00", activity: "🔄 Steady Progress", description: "Consistent productive work" },
            { time: "12:00-13:00", activity: "🧘 Mindful Break", description: "Reflective meal, mindfulness practice" },
            { time: "13:00-17:00", activity: "📊 Balanced Productivity", description: "Mix av focused work och collaboration" },
            { time: "17:00-19:00", activity: "👨‍👩‍👧‍👦 Quality Family Connection", description: "Engaged family time, meaningful conversations" },
            { time: "19:00-20:30", activity: "💡 Wisdom Integration", description: "Reflection on lessons learned" },
            { time: "20:30-22:00", activity: "🌅 Tomorrow's Foundation", description: "Gentle preparation, intention setting" }
        ],
        thursday: [
            { time: "05:00-06:30", activity: "🕌 Extended Spiritual Practice", description: "Djupare andlig tid för connection, guidance" },
            { time: "06:30-07:30", activity: "📖 Wisdom Study", description: "Study för wisdom och leadership perspective" },
            { time: "07:30-09:00", activity: "👨‍👩‍👧‍👦 Leadership Family Time", description: "Model leadership genom caring presence" },
            { time: "09:00-12:00", activity: "🌍 Strategic Leadership Work", description: "Community impact work, visionary planning" },
            { time: "12:00-13:00", activity: "🤲 Gratitude & Reflection", description: "Mindful meal med gratitude practice" },
            { time: "13:00-17:00", activity: "💼 Impactful Work", description: "Work som creates positive impact" },
            { time: "17:00-19:00", activity: "👨‍👩‍👧‍👦 Wisdom Family Time", description: "Share wisdom, model values" },
            { time: "19:00-20:30", activity: "📚 Community Learning", description: "Study för community service capacity" },
            { time: "20:30-22:00", activity: "🌟 Vision & Planning", description: "Long-term vision, strategic planning" }
        ],
        friday: [
            { time: "05:30-06:30", activity: "🎨 Creative Morning Flow", description: "Creative expression, innovative thinking" },
            { time: "06:30-07:30", activity: "✨ Inspiration Time", description: "Inspiring content, vision work" },
            { time: "07:30-09:00", activity: "👨‍👩‍👧‍👦 Joyful Family Time", description: "Playful, creative family interactions" },
            { time: "09:00-12:00", activity: "🚀 Creative Problem Solving", description: "Innovative work, creative solutions" },
            { time: "12:00-13:00", activity: "🎉 Celebration Break", description: "Acknowledge accomplishments, celebrate progress" },
            { time: "13:00-17:00", activity: "✅ Completion Focus", description: "Finish week's tasks med excellence" },
            { time: "17:00-19:00", activity: "👨‍👩‍👧‍👦 Weekend Transition", description: "Begin weekend mood med family" },
            { time: "19:00-20:30", activity: "🎨 Personal Creative Expression", description: "Personal creative projects, artistic expression" },
            { time: "20:30-22:00", activity: "🌅 Weekend Preparation", description: "Mental transition, gratitude för week" }
        ],
        saturday: [
            { time: "07:00-08:00", activity: "🌅 Gentle Awakening", description: "Slower morning routine, peaceful transition" },
            { time: "08:00-10:00", activity: "👨‍👩‍👧‍👦 Family Breakfast", description: "Extended family breakfast, meaningful conversations" },
            { time: "10:00-12:00", activity: "🏡 Home & Personal Care", description: "Home maintenance, personal organization" },
            { time: "12:00-14:00", activity: "👨‍👩‍👧‍👦 Family Activity Time", description: "Fun family activities, outdoor time" },
            { time: "14:00-15:00", activity: "💆‍♂️ Personal Restoration", description: "Self-care activities, relaxation" },
            { time: "15:00-17:00", activity: "🌳 Nature & Recreation", description: "Outdoor activities, recreational pursuits" },
            { time: "17:00-19:00", activity: "👨‍👩‍👧‍👦 Family Dinner", description: "Special family dinner, sharing stories" },
            { time: "19:00-21:00", activity: "🎭 Entertainment & Joy", description: "Family entertainment, movies, games" },
            { time: "21:00-22:00", activity: "🌙 Peaceful Evening", description: "Gentle wind-down, gratitude reflection" }
        ],
        sunday: [
            { time: "07:00-08:30", activity: "🌅 Reflective Morning", description: "Peaceful morning routine, week reflection" },
            { time: "08:30-10:00", activity: "👨‍👩‍👧‍👦 Meaningful Family Time", description: "Deep family conversations, sharing highlights" },
            { time: "10:00-12:00", activity: "📝 Week Review", description: "Systematic review av accomplishments och lessons" },
            { time: "12:00-14:00", activity: "🍽️ Leisurely Family Lunch", description: "Extended family meal, relaxed conversations" },
            { time: "14:00-16:00", activity: "📅 Strategic Week Planning", description: "Thoughtful planning för upcoming week" },
            { time: "16:00-18:00", activity: "🌱 Personal Growth Integration", description: "Apply insights, set development goals" },
            { time: "18:00-19:30", activity: "👨‍👩‍👧‍👦 Family Vision Time", description: "Share dreams, align on family direction" },
            { time: "19:30-21:00", activity: "📚 Inspirational Learning", description: "Read inspiring material för excellent week" },
            { time: "21:00-22:00", activity: "⚡ Monday Anticipation", description: "Build excited anticipation för fresh start" }
        ]
    },
    dayDescriptions: {
        monday: { theme: "🌅 Foundation & Fresh Start", summary: "Sätt tonen för veckan med kraftfull morning routine." },
        tuesday: { theme: "💪 Power & Peak Performance", summary: "Maximera produktivitet med peak performance execution." },
        wednesday: { theme: "⚖️ Balance & Sustainable Growth", summary: "Perfect balance mellan action och restoration." },
        thursday: { theme: "🕌 Spiritual Depth & Leadership", summary: "Djupare andlig connection som foundation för leadership." },
        friday: { theme: "🎨 Creativity & Completion", summary: "Innovativ completion och celebration av progress." },
        saturday: { theme: "🏡 Family & Restoration", summary: "Quality family time och gentle self-care." },
        sunday: { theme: "📝 Reflection & Preparation", summary: "Extract wisdom och prepare för upcoming adventures." }
    }
};

// Performance utilities
const PerformanceUtils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Efficient DOM query selector with caching
    querySelector(selector, parent = document) {
        return parent.querySelector(selector);
    },

    // Efficient DOM query selector all with caching
    querySelectorAll(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    }
};

// Time management utilities
const TimeUtils = {
    getCurrentTime() {
        const now = new Date();
        return {
            time: now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
            date: now.toLocaleDateString('sv-SE', { weekday: 'long', month: 'long', day: 'numeric' }),
            day: now.getDay(),
            minutes: now.getHours() * 60 + now.getMinutes()
        };
    },

    isCurrentTimeBlock(blockTime, currentMinutes) {
        const [startTime] = blockTime.split('-');
        const [hours, minutes] = startTime.split(':').map(Number);
        const blockMinutes = hours * 60 + minutes;
        return Math.abs(currentMinutes - blockMinutes) < 60;
    }
};

// DOM manipulation utilities
const DOMUtils = {
    // Efficient element creation
    createElement(tag, className, innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },

    // Efficient element update
    updateElement(element, className, innerHTML) {
        if (className !== undefined) element.className = className;
        if (innerHTML !== undefined) element.innerHTML = innerHTML;
    },

    // Batch DOM updates for better performance
    batchUpdate(elements, updates) {
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
            elements.forEach((element, index) => {
                if (updates[index]) {
                    Object.assign(element, updates[index]);
                }
            });
        });
    }
};

// Application controller
const AppController = {
    init() {
        if (DOM.initialized) return;
        
        this.cacheDOMElements();
        this.setupEventListeners();
        this.initializeApp();
        
        DOM.initialized = true;
    },

    cacheDOMElements() {
        DOM.currentTime = PerformanceUtils.querySelector('#currentTime');
        DOM.weekGrid = PerformanceUtils.querySelector('#weekGrid');
        DOM.views = PerformanceUtils.querySelectorAll('.view');
    },

    setupEventListeners() {
        // Use event delegation for better performance
        document.addEventListener('click', this.handleClick.bind(this));
        
        // Optimize scroll events
        window.addEventListener('scroll', PerformanceUtils.throttle(this.handleScroll.bind(this), 16));
        
        // Optimize resize events
        window.addEventListener('resize', PerformanceUtils.debounce(this.handleResize.bind(this), 250));
        
        // Prevent zoom on mobile
        document.addEventListener('gesturestart', (e) => e.preventDefault());
    },

    handleClick(event) {
        const target = event.target;
        
        // Handle action buttons
        if (target.matches('[data-action]')) {
            const action = target.dataset.action;
            this.handleAction(action, target.dataset);
            return;
        }

        // Handle day cards
        if (target.closest('.day-card')) {
            const dayCard = target.closest('.day-card');
            const day = dayCard.dataset.day;
            if (day) {
                this.showView(day);
            }
        }
    },

    handleAction(action, data) {
        switch (action) {
            case 'goToToday':
                this.goToToday();
                break;
            case 'showWeeklyReflection':
                this.showWeeklyReflection();
                break;
            case 'resetWeek':
                this.resetWeek();
                break;
            case 'showOverview':
                this.showView('week-overview');
                break;
            case 'showDay':
                this.showView(data.day);
                break;
        }
    },

    handleScroll() {
        // Handle scroll-based optimizations
        // Could implement lazy loading or virtual scrolling here
    },

    handleResize() {
        // Handle resize-based optimizations
        this.updateLayout();
    },

    initializeApp() {
        this.updateCurrentTime();
        this.generateWeekGrid();
        this.generateSchedules();
        
        // Update time every minute
        setInterval(() => this.updateCurrentTime(), 60000);
    },

    updateCurrentTime() {
        if (!DOM.currentTime) return;
        
        const timeData = TimeUtils.getCurrentTime();
        DOM.currentTime.innerHTML = `${timeData.time}<br><small>${timeData.date}</small>`;
    },

    generateWeekGrid() {
        if (!DOM.weekGrid) return;
        
        const timeData = TimeUtils.getCurrentTime();
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayNames = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];
        
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        days.forEach((day, index) => {
            const isToday = (index + 1) % 7 === timeData.day;
            const dayData = AppState.dayDescriptions[day];
            
            const dayCard = DOMUtils.createElement('div', `day-card ${day} ${isToday ? 'today' : ''}`);
            dayCard.dataset.day = day;
            
            dayCard.innerHTML = `
                <div class="day-header ${day}">
                    ${dayNames[index]}
                    ${isToday ? '<div class="today-indicator">IDAG</div>' : ''}
                </div>
                <div class="day-content">
                    <div class="day-theme">${dayData.theme}</div>
                    <div class="day-description">${dayData.summary}</div>
                </div>
            `;
            
            fragment.appendChild(dayCard);
        });
        
        // Clear and append in one operation
        DOM.weekGrid.innerHTML = '';
        DOM.weekGrid.appendChild(fragment);
    },

    generateSchedules() {
        Object.keys(AppState.scheduleData).forEach(day => {
            this.generateDaySchedule(day);
        });
    },

    generateDaySchedule(day) {
        const scheduleEl = PerformanceUtils.querySelector(`#${day}Schedule`);
        if (!scheduleEl) return;
        
        const schedule = AppState.scheduleData[day];
        const timeData = TimeUtils.getCurrentTime();
        
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        schedule.forEach((block) => {
            const isCurrentBlock = TimeUtils.isCurrentTimeBlock(block.time, timeData.minutes);
            
            const timeBlock = DOMUtils.createElement('div', `time-block ${isCurrentBlock ? 'current' : ''}`);
            timeBlock.innerHTML = `
                <div class="time">${block.time}</div>
                <div class="activity">${block.activity}</div>
                <div class="description">${block.description}</div>
            `;
            
            fragment.appendChild(timeBlock);
        });
        
        // Clear and append in one operation
        scheduleEl.innerHTML = '';
        scheduleEl.appendChild(fragment);
    },

    showView(viewId) {
        // Use requestAnimationFrame for smooth transitions
        requestAnimationFrame(() => {
            DOM.views.forEach(view => {
                view.classList.remove('active');
            });
            
            const targetView = PerformanceUtils.querySelector(`#${viewId}`);
            if (targetView) {
                targetView.classList.add('active');
                AppState.currentView = viewId;
                
                if (viewId !== 'week-overview') {
                    this.generateDaySchedule(viewId);
                    document.body.className = `${viewId}-scheme`;
                } else {
                    document.body.className = '';
                }
            }
        });
    },

    goToToday() {
        const timeData = TimeUtils.getCurrentTime();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDay = dayNames[timeData.day];
        this.showView(currentDay);
    },

    showWeeklyReflection() {
        // Use modern alert or create custom modal
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Veckoreflektionsfunktion kommer snart! 📝');
        } else {
            alert('Veckoreflektionsfunktion kommer snart! 📝');
        }
    },

    resetWeek() {
        if (confirm('Starta om veckan?')) {
            // Use modern notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Veckan återställd! 🔄');
            } else {
                alert('Veckan återställd! 🔄');
            }
        }
    },

    updateLayout() {
        // Handle responsive layout updates
        // Could implement dynamic grid adjustments here
    }
};

// Service Worker registration for caching
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AppController.init());
} else {
    AppController.init();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppController;
}