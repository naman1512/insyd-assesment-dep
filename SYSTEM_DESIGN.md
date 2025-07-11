# Insyd Notification System - System Design Document

## Overview

This document outlines the design of a scalable notification system for Insyd, a social platform for the Architecture Industry. The system is designed to handle 100 DAUs initially with the ability to scale to 1 million DAUs.

## Problem Statement

Insyd needs to notify users of relevant activities including:

- Posts from people they follow
- New followers
- Organic content discovery
- Job postings
- Chat messages
- Blog interactions (likes, comments)

## System Architecture

### High-Level Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Notification  │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Database      │    │   Queue System  │
                       │   (PostgreSQL)  │    │   (Redis)       │
                       └─────────────────┘    └─────────────────┘
```

### Core Components

#### 1. Notification Service

- **Purpose**: Central hub for creating, managing, and delivering notifications
- **Responsibilities**:
  - Generate notifications from various triggers
  - Store notification metadata
  - Determine delivery channels (real-time, email, push)
  - Handle notification preferences

#### 2. Event Processing System

- **Purpose**: Process user actions and generate relevant notifications
- **Components**:
  - Event Publishers (from various services)
  - Event Queue (Redis)
  - Event Processors (notification generators)

#### 3. Real-time Delivery System

- **Purpose**: Deliver notifications in real-time to active users
- **Technology**: WebSocket connections (Socket.IO)
- **Features**:
  - Instant notification delivery
  - Connection management
  - Fallback mechanisms

#### 4. Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Follows table
CREATE TABLE follows (
    id UUID PRIMARY KEY,
    follower_id UUID REFERENCES users(id),
    following_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table (for demo)
CREATE TABLE posts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## System Flow

### 1. Event Generation

```
User Action → Event Publisher → Redis Queue → Event Processor → Notification Service
```

### 2. Notification Types

- **FOLLOW**: User A follows User B → Notify User B
- **POST**: User A creates a post → Notify all followers of A
- **LIKE**: User A likes User B's post → Notify User B
- **COMMENT**: User A comments on User B's post → Notify User B

### 3. Delivery Flow

```
Notification Created → Real-time Check → WebSocket Delivery (if online) → Database Storage
```

## Performance Considerations

### For 100 DAUs (Current)

- **Database**: Single PostgreSQL instance
- **Queue**: Single Redis instance
- **Real-time**: In-memory WebSocket management
- **Expected Load**: ~1,000 notifications/day

### For 1M DAUs (Future Scale)

- **Database**: Read replicas, connection pooling
- **Queue**: Redis Cluster with partitioning
- **Real-time**: Horizontal scaling with load balancers
- **Expected Load**: ~10M notifications/day

## Scalability Strategy

### Phase 1 (100 DAUs)

- Single server deployment
- Basic notification types
- Simple WebSocket implementation

### Phase 2 (10K DAUs)

- Separate notification service
- Message queue implementation
- Database optimization

### Phase 3 (100K DAUs)

- Microservices architecture
- Caching layer (Redis)
- Load balancing

### Phase 4 (1M DAUs)

- Distributed queue system
- Database sharding
- CDN for static assets
- Advanced caching strategies

## Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **Socket.IO Client**: Real-time communication
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

### Backend

- **Node.js**: Server runtime
- **Express.js**: Web framework
- **Socket.IO**: WebSocket implementation
- **PostgreSQL**: Primary database
- **Redis**: Queue and caching
- **Prisma**: Database ORM

### Deployment

- **Vercel**: Frontend hosting
- **Railway/Heroku**: Backend hosting
- **Supabase**: Database hosting

## Security Considerations

### Authentication

- JWT tokens for API authentication
- WebSocket authentication via handshake

### Authorization

- User-based notification access
- Rate limiting on notification endpoints

### Data Privacy

- Encrypted sensitive data
- GDPR compliance for notification preferences

## Monitoring and Metrics

### Key Metrics

- **Delivery Rate**: % of notifications successfully delivered
- **Latency**: Time from event to delivery
- **User Engagement**: % of notifications clicked/read
- **System Health**: Queue depth, database performance

### Monitoring Tools

- Application logs
- Database query monitoring
- Queue depth monitoring
- WebSocket connection metrics

## Limitations and Trade-offs

### Current Limitations

- No email/push notifications (POC focus)
- Basic notification types only
- No advanced filtering/preferences
- Single-tenant architecture

### Trade-offs Made

- **Simplicity vs Features**: Focused on core functionality
- **Performance vs Complexity**: Chose simpler solutions for MVP
- **Cost vs Scalability**: Optimized for low initial cost

## Future Enhancements

### Short-term (3-6 months)

- Email notifications
- Push notifications
- User preferences
- Notification batching

### Medium-term (6-12 months)

- AI-powered notification relevance
- Advanced filtering
- Notification scheduling
- Analytics dashboard

### Long-term (12+ months)

- Multi-tenant architecture
- Advanced personalization
- Integration with external services
- Machine learning for notification optimization

## Conclusion

This notification system is designed to grow with Insyd from a startup to a platform serving millions of users. The architecture prioritizes simplicity and cost-effectiveness for the initial phase while maintaining clear paths for scaling. The modular design allows for incremental improvements and feature additions as the platform grows.

The POC implementation focuses on the core notification functionality needed to demonstrate the system's viability while keeping complexity manageable for rapid development and iteration.
