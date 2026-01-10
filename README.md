# n8n-nodes-lattice

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for [Lattice](https://lattice.com), a people management platform for performance reviews, goal setting, 1:1s, feedback, and employee engagement. This node integrates with Lattice's REST API to enable workflow automation for performance management, goal tracking, and HR analytics.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **User Management**: Create, update, deactivate users; manage manager hierarchies and direct reports
- **Team Operations**: Create and manage teams; handle team membership and hierarchies
- **Goal Tracking**: Full OKR support with key results, progress tracking, and alignment
- **Performance Reviews**: Access review cycles, responses, questions, and feedback
- **Continuous Feedback**: Send and receive feedback; track feedback analytics
- **1:1 Meetings**: Schedule meetings, manage agendas, and capture notes
- **Status Updates**: Post updates with mood tracking and blocker reporting
- **Praise & Recognition**: Send kudos aligned with company core values
- **Competencies**: Access competency frameworks and user ratings
- **Custom Attributes**: Extend user profiles with custom fields

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-lattice`
5. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-lattice
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-lattice.git
cd n8n-nodes-lattice

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n (Linux/macOS)
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-lattice

# Restart n8n
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Bearer token from Lattice Admin panel | Yes |

### Obtaining API Credentials

1. Log in to your Lattice account as an admin
2. Navigate to **Admin** → **Organization** → **Settings** → **API Keys**
3. Create a new API key
4. Copy the generated API key

> **Note**: API access requires approval from Lattice. Contact Lattice support to enable API access for your organization.

## Resources & Operations

### User

| Operation | Description |
|-----------|-------------|
| Create | Create a new user (invite) |
| Get | Get user by ID |
| Get All | List all users with pagination |
| Update | Update user details |
| Deactivate | Deactivate user account |
| Get Manager | Get user's manager |
| Update Manager | Change user's manager |
| Get Direct Reports | List user's direct reports |

### Team

| Operation | Description |
|-----------|-------------|
| Create | Create a new team |
| Get | Get team by ID |
| Get All | List all teams |
| Update | Update team details |
| Delete | Remove team |
| Get Members | List team members |
| Add Member | Add user to team |
| Remove Member | Remove user from team |

### Goal

| Operation | Description |
|-----------|-------------|
| Create | Create a new goal |
| Get | Get goal by ID |
| Get All | List all goals with filters |
| Update | Update goal details |
| Delete | Remove goal |
| Get Progress | Get progress updates |
| Add Progress Update | Add update to goal |
| Get by User | Get user's goals |
| Get by Team | Get team's goals |

### Review

| Operation | Description |
|-----------|-------------|
| Get Cycles | List all review cycles |
| Get Cycle | Get cycle by ID |
| Get Review | Get specific review |
| Get by User | Get user's reviews |
| Get Questions | Get cycle questions |
| Get Responses | Get submitted responses |

### Feedback

| Operation | Description |
|-----------|-------------|
| Create | Give feedback |
| Get | Get feedback by ID |
| Get All | List feedback with filters |
| Request | Request feedback from others |
| Get by User | Feedback for/from user |
| Get Stats | Feedback analytics |

### One-on-One (1:1)

| Operation | Description |
|-----------|-------------|
| Create | Schedule 1:1 meeting |
| Get | Get 1:1 by ID |
| Get All | List all 1:1 meetings |
| Update | Update 1:1 details |
| Get Agenda | Get agenda items |
| Add Agenda Item | Add item to agenda |
| Get Notes | Get meeting notes |
| Add Note | Add note to meeting |

### Update

| Operation | Description |
|-----------|-------------|
| Create | Post status update |
| Get | Get update by ID |
| Get All | List status updates |
| Get by User | User's updates |
| Get by Team | Team's updates |

### Praise

| Operation | Description |
|-----------|-------------|
| Create | Give praise/kudos |
| Get | Get praise by ID |
| Get All | List all praise |
| Get by User | Praise received by user |
| Get Given by User | Praise given by user |

### Competency

| Operation | Description |
|-----------|-------------|
| Get | Get competency by ID |
| Get All | List all competencies |
| Get by User | User's competency ratings |
| Get by Level | Competencies for job level |

### Custom Attribute

| Operation | Description |
|-----------|-------------|
| Get Definitions | List attribute definitions |
| Get by User | Get user's custom fields |
| Update by User | Update user's custom fields |

## Usage Examples

### Create a New User

```javascript
// Node configuration
{
  "resource": "user",
  "operation": "create",
  "email": "jane.doe@company.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "title": "Senior Engineer",
  "department": "Engineering",
  "startDate": "2024-01-15"
}
```

### Create a Goal with Key Results

```javascript
// Node configuration
{
  "resource": "goal",
  "operation": "create",
  "ownerId": "user_123",
  "title": "Increase Customer Satisfaction",
  "description": "Improve NPS score through better support",
  "timePeriod": "Q1",
  "year": 2024,
  "keyResults": [
    { "title": "Improve NPS to 70+", "targetValue": 70 },
    { "title": "Reduce ticket response time to <2hrs", "targetValue": 2 }
  ]
}
```

### Schedule a 1:1 Meeting

```javascript
// Node configuration
{
  "resource": "oneOnOne",
  "operation": "create",
  "managerId": "user_456",
  "reportId": "user_789",
  "frequency": "weekly",
  "scheduledAt": "2024-01-20T14:00:00Z"
}
```

### Give Praise with Core Values

```javascript
// Node configuration
{
  "resource": "praise",
  "operation": "create",
  "receiverId": "user_123",
  "body": "Amazing job on the product launch! Your attention to detail made all the difference.",
  "coreValueId": "excellence",
  "visibility": "public"
}
```

## Lattice Concepts

### Goal Time Periods
- **Q1, Q2, Q3, Q4**: Quarterly goals
- **Annual**: Full-year objectives

### Goal Status
- **on_track**: Goal progressing as planned
- **behind**: Goal falling behind schedule
- **at_risk**: Goal at risk of not being met
- **complete**: Goal achieved

### Review Types
- **self**: Self-assessment
- **peer**: Peer review
- **manager**: Manager review
- **upward**: Upward feedback to manager

### Feedback Visibility
- **public**: Visible to everyone
- **private**: Only visible to giver and receiver
- **manager_only**: Visible to receiver and their manager

### 1:1 Frequency
- **weekly**: Every week
- **biweekly**: Every two weeks
- **monthly**: Once a month

## Error Handling

The node handles common Lattice API errors:

| HTTP Status | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid or expired API key |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Data validation failed |
| 429 | Rate Limited | Too many requests |

## Security Best Practices

1. **API Key Security**: Store API keys securely using n8n credentials
2. **Least Privilege**: Use API keys with minimal required permissions
3. **Audit Logging**: Monitor API usage through Lattice admin panel
4. **Data Privacy**: Be mindful of PII in feedback and reviews

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Fix lint issues
npm run lint:fix
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [Lattice API Docs](https://developers.lattice.com)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-lattice/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)

## Acknowledgments

- [Lattice](https://lattice.com) for their people management platform
- [n8n](https://n8n.io) for the workflow automation platform
- The n8n community for their support and contributions
