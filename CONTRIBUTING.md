# Contributing to SwarmTech

Thank you for your interest in contributing to SwarmTech! This guide will help you get started.

## Getting Started

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally
3. **Set up the development environment** (see below)
4. **Create a branch** for your changes
5. **Make your changes** and test them
6. **Submit a pull request**

## Development Setup

### Using Docker (Recommended)

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/SwarmTech.git
cd SwarmTech

# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual Setup

See [SETUP.md](SETUP.md#manual-setup-without-docker) for detailed instructions.

## Project Structure

```
SwarmTech/
├── api/                    # Backend API server
│   ├── database/          # Database schema and migrations
│   ├── routes/            # API route handlers
│   └── server.js          # Main server file
├── client/                # Frontend application
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript components
│   │   ├── api.js        # API client
│   │   ├── chatBox.js    # Chat component
│   │   ├── login.js      # Login component
│   │   ├── main.js       # Main app component
│   │   └── map.js        # Map component
│   └── index.html        # Main HTML file
├── docs/                 # Documentation and assets
├── docker-compose.yml    # Docker orchestration
├── ARCHITECTURE.md       # System architecture
├── SETUP.md             # Setup instructions
└── README.md            # Project overview
```

## Making Changes

### Backend Changes

**Adding a new API endpoint:**

1. Create or edit a route file in `api/routes/`
2. Add the route to `api/server.js`
3. Test the endpoint
4. Update API documentation in `SETUP.md`

Example:
```javascript
// api/routes/example.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', async (req, res) => {
  // Your code here
});

module.exports = router;
```

**Database changes:**

1. Edit `api/database/schema.sql`
2. Add migration script if needed
3. Test with fresh database: `docker-compose down -v && docker-compose up -d`

### Frontend Changes

**Modifying components:**

1. Edit files in `client/js/`
2. Refresh browser to see changes
3. Test in multiple browsers
4. Test responsive design (mobile/desktop)

**Adding new features:**

1. Create new component file
2. Add component to `index.html`
3. Update styles in `client/css/`
4. Test thoroughly

### Styling

Edit `client/css/app.css` for styling changes. Follow existing patterns:
- Use CSS classes, not inline styles
- Test on mobile and desktop
- Ensure accessibility (contrast, focus states)

## Testing

### Manual Testing

1. **Login flow**: Test user registration and login
2. **Chat**: Send messages from multiple tabs
3. **Map**: Move map in one tab, verify updates in other tabs
4. **WebSocket**: Check real-time sync works
5. **Mobile**: Test on mobile devices or browser dev tools

### Browser Testing

Test in at least:
- Chrome/Edge
- Firefox
- Safari (if available)

### Load Testing

Open 5-10 tabs to simulate multiple users.

## Code Style

### JavaScript
- Use ES6+ features (const, let, arrow functions)
- Use async/await for asynchronous code
- Add comments for complex logic
- Handle errors gracefully

### Vue.js Components
- Follow Vue 2 component conventions
- Use props for parent-child communication
- Emit events for child-parent communication
- Keep components focused and reusable

### SQL
- Use parameterized queries (prevent SQL injection)
- Add indexes for frequently queried fields
- Write clear, readable queries

## Pull Request Process

1. **Update documentation** if you changed functionality
2. **Test your changes** thoroughly
3. **Write a clear PR description**:
   - What does this PR do?
   - Why is it needed?
   - How to test it?
4. **Keep PRs focused**: One feature/fix per PR
5. **Respond to feedback**: Be open to suggestions

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style
- [ ] Documentation updated
- [ ] Tested locally
- [ ] No console errors
```

## Reporting Issues

### Bug Reports

Include:
- **Description**: What happened vs. what you expected
- **Steps to reproduce**: Detailed steps
- **Environment**: Browser, OS, Docker version
- **Screenshots/logs**: If applicable
- **Console errors**: Check browser console

### Feature Requests

Include:
- **Use case**: Why is this needed?
- **Proposed solution**: How might it work?
- **Alternatives**: Other approaches considered

## Areas for Contribution

### Good First Issues

- Improve error messages
- Add input validation
- Improve mobile UI
- Add unit tests
- Update documentation
- Fix typos

### Medium Difficulty

- Add user avatars
- Implement message timestamps
- Add pin types/icons
- Improve WebSocket reconnection
- Add loading states

### Advanced

- Add authentication (JWT)
- Implement teams/groups
- Add voice chat (WebRTC)
- Implement offline mode
- Add file sharing
- Create mobile app

## Communication

- **Issues**: Use GitHub issues for bugs and features
- **Discussions**: Use GitHub discussions for questions
- **Gitter**: Join [gitter.im/JSVillage](https://gitter.im/JSVillage) for chat

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Don't hesitate to ask! Open an issue or discussion if you need help.

Thank you for contributing to SwarmTech! 🚀
