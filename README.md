# Todo Vue App

A Vue 3 Todo App built with Vue CLI, Vue Router, and Composition API — matching the dashboard design.

---

## 📁 Project Structure

```
todo-vue-app/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── global.css          # CSS variables & base styles
│   ├── composables/
│   │   ├── useTasks.js         # Shared task state & actions
│   │   ├── useDate.js          # Date formatting utilities
│   │   └── useToast.js         # Global toast notifications
│   ├── components/
│   │   ├── AppSidebar.vue      # Left sidebar with nav
│   │   ├── AppTopbar.vue       # Top header bar
│   │   ├── StatCard.vue        # Reusable stat card
│   │   ├── TaskTable.vue       # Tasks table with actions
│   │   ├── AddTaskModal.vue    # Add task modal
│   │   └── ViewTaskModal.vue   # View/toggle task modal
│   ├── views/
│   │   ├── DashboardView.vue   # Dashboard page (main)
│   │   ├── TasksView.vue       # All tasks page
│   │   ├── CalendarView.vue    # Calendar (placeholder)
│   │   └── FavoritesView.vue   # Favorites (placeholder)
│   ├── router/
│   │   └── index.js            # Vue Router config
│   ├── App.vue                 # Root component + layout
│   └── main.js                 # Entry point
├── babel.config.js
├── vue.config.js
└── package.json
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js >= 14
- npm or yarn

### Install Vue CLI (if not already installed)
```bash
npm install -g @vue/cli
```

### Install dependencies
```bash
cd todo-vue-app
npm install
```

### Start development server
```bash
npm run serve
```

App runs at: **http://localhost:8080**

### Build for production
```bash
npm run build
```

---

## ✨ Features

- **Dashboard** with date picker and Today button
- **4 stat cards** — Total, Completed, Pending, Due Today
- **Tasks table** with view 👁 and delete 🗑 actions
- **Add Task modal** — title, date, time, status
- **View Task modal** — toggle Pending ↔ Completed
- **Vue Router** — Dashboard, Tasks, Calendar, Favorites pages
- **Composables** — `useTasks`, `useDate`, `useToast`
- **Toast notifications** for all actions
- **Smooth page transitions**

---

## 🛠 Tech Stack

| Tool        | Version |
|-------------|---------|
| Vue         | 3.x     |
| Vue Router  | 4.x     |
| Vue CLI     | 5.x     |
| Composition API | ✅  |
