📄 01_System_Architecture.md

This is the document every engineer will keep open while coding.

It answers one question:

"How does the entire system work?"

Not code.

Not database.

Not APIs.

The entire ecosystem.

📄 02_System_Architecture.md

Project: People's Priorities AI

Version: 1.0

Status: Draft → Review → Locked

Owner: Engineering Team

1. Purpose

This document defines the complete technical architecture of the People's Priorities AI platform.

It establishes:

System boundaries
Service decomposition
Data flow
AI pipeline
Deployment architecture
Technology ownership
Component responsibilities

This document serves as the master architectural reference for all Software Design Documents (SDDs).

2. Architecture Philosophy

The platform follows six architectural principles.

Principle 1
Vertical Slice Architecture

Every feature is built end-to-end.

Frontend

↓

API

↓

Business Logic

↓

AI

↓

Database

↓

Testing

No horizontal development.

Principle 2
Pipeline-Based Design

The system is composed of independent pipelines.

Each pipeline owns one business capability.

Principle 3
AI as a Service

AI is isolated.

Business logic never directly depends on Gemini.

Principle 4
Immutable Raw Data

Citizen submissions are never modified.

Only new objects are created.

Principle 5
Evidence Before Recommendation

Recommendations cannot exist without evidence.

Principle 6
Explainability First

Every recommendation must be explainable.

3. High-Level System Context
                    Citizens
                        │
                        ▼
               Citizen Web App
                        │
                        ▼
                 Backend API Layer
                        │
      ┌─────────────────┼──────────────────┐
      ▼                 ▼                  ▼
 AI Intelligence   Data Layer       External APIs
      │                 │                  │
      └─────────────────┼──────────────────┘
                        │
                        ▼
                 MP Dashboard
4. Architecture Layers

The platform consists of five logical layers.

Layer 1

Presentation Layer

Components

Citizen Portal
MP Dashboard

Responsibilities

User interaction
Input collection
Data visualization

No business logic.

Layer 2

Application Layer

Components

Submission Service
Issue Service
Evidence Service
Priority Service
Dashboard Service

Responsibilities

Validation
Routing
Orchestration
Business workflows
Layer 3

AI Intelligence Layer

Components

Understanding Engine
Embedding Engine
Reasoning Engine

Responsibilities

Speech understanding
Vision analysis
Structuring
Clustering
Decision explanation
Layer 4

Data Layer

Components

Firestore
Firebase Storage
ChromaDB
BigQuery

Responsibilities

Storage
Retrieval
Analytics
Similarity Search
Layer 5

External Services

Components

Gemini API
Google Maps
Speech-to-Text
Earth Engine
Public Datasets

Responsibilities

External intelligence.

5. Business Pipelines

The system contains four business pipelines.

Pipeline 1

Citizen Intake Pipeline

Citizen

↓

Web App

↓

Submission API

↓

Firestore

↓

CitizenSubmission

Owner

Cluster 1

Pipeline 2

AI Intelligence Pipeline

CitizenSubmission

↓

Gemini

↓

StructuredIssue

↓

Embedding

↓

IssueCluster

Owner

Clusters 2 & 3

Pipeline 3

Decision Intelligence Pipeline

IssueCluster

↓

Evidence Engine

↓

Priority Engine

↓

Decision Brief

Owner

Clusters 4 & 5

Pipeline 4

Presentation Pipeline

Decision Brief

↓

Dashboard API

↓

React Dashboard

↓

MP

Owner

Cluster 6

6. Canonical Data Flow
CitizenSubmission

↓

StructuredIssue

↓

IssueCluster

↓

EvidenceObject

↓

PriorityAssessment

↓

DecisionBrief

Every stage enriches the previous object.

Objects are immutable.

7. Service Boundaries
Service	Responsibility	Cluster
Submission Service	Capture citizen inputs	1
Understanding Service	AI understanding	2
Issue Intelligence Service	Clustering	3
Evidence Service	Public data enrichment	4
Priority Service	Deterministic scoring	5
Recommendation Service	Decision Brief generation	5
Dashboard Service	Visualization	6
8. Communication Model

The system follows synchronous request-response for the MVP.

Frontend

↓

FastAPI

↓

Service

↓

AI/Database

↓

Response

Future versions may introduce asynchronous queues.

9. Technology Mapping
Layer	Technology
Frontend	React + Tailwind CSS
Backend	FastAPI
AI	Gemini API
Storage	Firebase Storage
Database	Firestore
Vector Store	ChromaDB (MVP)
Analytics	BigQuery
Maps	Google Maps Platform
Deployment	Cloud Run + Firebase Hosting
10. Deployment Topology
Browser
     │
     ▼
Firebase Hosting
     │
     ▼
Cloud Run
     │
 ┌───┴───────────────┐
 ▼                   ▼

Firestore      AI Services
                   │
          Gemini API
                   │
          ChromaDB
                   │
           BigQuery
11. Security Architecture

Principles

HTTPS only
API key protection
Environment variables
Input validation
Prompt injection mitigation
Secure Firebase Rules
12. Scalability Strategy

Future scaling.

Separate

AI Services
Backend APIs
Database
Vector Search
Analytics

All services are stateless.

13. Fault Tolerance

If Gemini fails

↓

Submission still stored.

If BigQuery fails

↓

Recommendation generated using available evidence.

If Maps fail

↓

Issue still processed.

Graceful degradation.

14. Observability

Logging

Metrics

Tracing

Every request receives:

Request ID
Correlation ID
Processing time
AI latency
15. Architecture Decision Records (ADR)
ADR-001

Vertical Slice Architecture

Status

Accepted

ADR-002

AI as Independent Service

Status

Accepted

ADR-003

Deterministic Priority Engine

Status

Accepted

ADR-004

Immutable Data Objects

Status

Accepted

ADR-005

Pipeline-Based Development

Status

Accepted

16. Risks
AI output inconsistency
Public dataset quality
Large image uploads
API quotas
Cloud latency

Mitigation strategies will be defined in individual cluster SDDs.

17. Future Architecture

Possible additions

Event-driven architecture
Pub/Sub messaging
Agentic AI workflows
Multi-model routing
Vector Search migration
Kubernetes deployment
18. Architecture Validation Checklist

Before implementation:

 Every service has one responsibility.
 Every pipeline has a clear owner.
 Every object is immutable.
 AI is isolated from business logic.
 Data flows in one direction.
 Every recommendation is explainable.