--USERS

-- you can user gen_random_uuid () to generate random IDs, use this only to generate testdata


insert into users (id, email,first_name,last_name, password)
values ('ba804cb9-fa14-42a5-afaf-be488742fc54', 'admin@example.com', 'James','Bond', '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6' ), -- Password: 1234
('0d8fa44c-54fd-4cd0-ace9-2a7da57992de', 'user@example.com', 'Tyler','Durden', '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6') -- Password: 1234
 ON CONFLICT DO NOTHING;


--ROLES
INSERT INTO role(id, name)
VALUES ('d29e709c-0ff1-4f4c-a7ef-09f656c390f1', 'DEFAULT'),
('ab505c92-7280-49fd-a7de-258e618df074', 'ADMIN'),
('c6aee32d-8c35-4481-8b3e-a876a39b0c02', 'USER')
ON CONFLICT DO NOTHING;

--AUTHORITIES
INSERT INTO authority(id, name)
VALUES ('2ebf301e-6c61-4076-98e3-2a38b31daf86', 'USER_CREATE'),
('76d2cbf6-5845-470e-ad5f-2edb9e09a868', 'USER_READ'),
('21c942db-a275-43f8-bdd6-d048c21bf5ab', 'USER_DEACTIVATE'),
('3f9d401e-7d72-5187-a9f4-3fc9c42e0b97', 'BLOGPOST_CREATE'),
('4a8e512f-8e83-6298-b0a5-4ad0d53f1c08', 'BLOGPOST_READ'),
('5b9f623a-9f94-7309-c1b6-5be1e64a2d19', 'BLOGPOST_MODIFY'),
('6c0a734b-0a05-8410-d2c7-6cf2f75b3e20', 'BLOGPOST_DELETE'),
('7d1b845c-1b16-9521-e3d8-7da3a86c4f31', 'USER_MODIFY'),
-- New granular authorities
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'BLOGPOST_EDIT_OWN'),
('b2c3d4e5-f678-9012-3456-7890abcdef12', 'BLOGPOST_DELETE_OWN'),
('c3d4e5f6-7890-1234-5678-90abcdef1234', 'BLOGPOST_EDIT_ANY'),
('d4e5f678-9012-3456-7890-abcdef123456', 'BLOGPOST_DELETE_ANY')
ON CONFLICT DO NOTHING;

--assign roles to users
insert into users_role (users_id, role_id)
values ('ba804cb9-fa14-42a5-afaf-be488742fc54', 'd29e709c-0ff1-4f4c-a7ef-09f656c390f1'),
       ('0d8fa44c-54fd-4cd0-ace9-2a7da57992de', 'd29e709c-0ff1-4f4c-a7ef-09f656c390f1'),
       ('0d8fa44c-54fd-4cd0-ace9-2a7da57992de', 'c6aee32d-8c35-4481-8b3e-a876a39b0c02'),
       ('ba804cb9-fa14-42a5-afaf-be488742fc54', 'ab505c92-7280-49fd-a7de-258e618df074'),
       ('ba804cb9-fa14-42a5-afaf-be488742fc54', 'c6aee32d-8c35-4481-8b3e-a876a39b0c02')
 ON CONFLICT DO NOTHING;

--assign authorities to roles
INSERT INTO role_authority(role_id, authority_id)
VALUES 
-- DEFAULT role
('d29e709c-0ff1-4f4c-a7ef-09f656c390f1', '2ebf301e-6c61-4076-98e3-2a38b31daf86'),
('d29e709c-0ff1-4f4c-a7ef-09f656c390f1', '4a8e512f-8e83-6298-b0a5-4ad0d53f1c08'), -- BLOGPOST_READ
-- ADMIN role
('ab505c92-7280-49fd-a7de-258e618df074', '76d2cbf6-5845-470e-ad5f-2edb9e09a868'),
('ab505c92-7280-49fd-a7de-258e618df074', '7d1b845c-1b16-9521-e3d8-7da3a86c4f31'), -- USER_MODIFY
('ab505c92-7280-49fd-a7de-258e618df074', '3f9d401e-7d72-5187-a9f4-3fc9c42e0b97'), -- BLOGPOST_CREATE
('ab505c92-7280-49fd-a7de-258e618df074', '4a8e512f-8e83-6298-b0a5-4ad0d53f1c08'), -- BLOGPOST_READ
('ab505c92-7280-49fd-a7de-258e618df074', '5b9f623a-9f94-7309-c1b6-5be1e64a2d19'), -- BLOGPOST_MODIFY
('ab505c92-7280-49fd-a7de-258e618df074', '6c0a734b-0a05-8410-d2c7-6cf2f75b3e20'), -- BLOGPOST_DELETE
('ab505c92-7280-49fd-a7de-258e618df074', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'), -- BLOGPOST_EDIT_OWN
('ab505c92-7280-49fd-a7de-258e618df074', 'b2c3d4e5-f678-9012-3456-7890abcdef12'), -- BLOGPOST_DELETE_OWN
('ab505c92-7280-49fd-a7de-258e618df074', 'c3d4e5f6-7890-1234-5678-90abcdef1234'), -- BLOGPOST_EDIT_ANY
('ab505c92-7280-49fd-a7de-258e618df074', 'd4e5f678-9012-3456-7890-abcdef123456'), -- BLOGPOST_DELETE_ANY
-- USER role
('c6aee32d-8c35-4481-8b3e-a876a39b0c02', '21c942db-a275-43f8-bdd6-d048c21bf5ab'),
('c6aee32d-8c35-4481-8b3e-a876a39b0c02', '7d1b845c-1b16-9521-e3d8-7da3a86c4f31'), -- USER_MODIFY
('c6aee32d-8c35-4481-8b3e-a876a39b0c02', '3f9d401e-7d72-5187-a9f4-3fc9c42e0b97'), -- BLOGPOST_CREATE
('c6aee32d-8c35-4481-8b3e-a876a39b0c02', '4a8e512f-8e83-6298-b0a5-4ad0d53f1c08'), -- BLOGPOST_READ
('c6aee32d-8c35-4481-8b3e-a876a39b0c02', '5b9f623a-9f94-7309-c1b6-5be1e64a2d19'), -- BLOGPOST_MODIFY
('c6aee32d-8c35-4481-8b3e-a876a39b0c02', '6c0a734b-0a05-8410-d2c7-6cf2f75b3e20'),  -- BLOGPOST_DELETE
('c6aee32d-8c35-4481-8b3e-a876a39b0c02', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'), -- BLOGPOST_EDIT_OWN
('c6aee32d-8c35-4481-8b3e-a876a39b0c02', 'b2c3d4e5-f678-9012-3456-7890abcdef12')  -- BLOGPOST_DELETE_OWN
 ON CONFLICT DO NOTHING;

--BLOG POSTS (Test data)
INSERT INTO blog_post(id, title, text, category, author_id, created_at, updated_at)
VALUES 
('e8a91b32-8c46-4e89-a5f2-1a2b3c4d5e6f', 'Getting Started with Spring Boot', 
 'Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications. This comprehensive guide will walk you through the basics.', 
 'Technology', '0d8fa44c-54fd-4cd0-ace9-2a7da57992de', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
 
('f9b02c43-9d57-5f90-b6a3-2b3c4d5e6f7a', 'The Art of Code Review', 
 'Code reviews are essential for maintaining code quality. Learn the best practices for effective code reviews and how to give constructive feedback.', 
 'Development', 'ba804cb9-fa14-42a5-afaf-be488742fc54', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
 
('a0c13d54-0e68-6a01-c7b4-3c4d5e6f7a8b', 'PostgreSQL Performance Tips', 
 'Database performance is crucial for modern applications. Here are some proven tips to optimize your PostgreSQL queries and improve overall performance.', 
 'Database', '0d8fa44c-54fd-4cd0-ace9-2a7da57992de', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Additional test data for UC4 pagination/sorting/filtering testing
('b1d24e65-1f79-7b12-d8c5-4d5e6f7a8b9c', 'Microservices Architecture Patterns',
 'Explore common patterns and best practices for building scalable microservices. Learn about service discovery, API gateways, and distributed systems.',
 'Technology', 'ba804cb9-fa14-42a5-afaf-be488742fc54', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),

('c2e35f76-2a80-8c23-e9d6-5e6f7a8b9c0d', 'React Hooks Deep Dive',
 'Master React Hooks with this comprehensive guide. Learn useState, useEffect, useContext, and how to create custom hooks for cleaner components.',
 'Development', '0d8fa44c-54fd-4cd0-ace9-2a7da57992de', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),

('d3f46a87-3b91-9d34-f0e7-6f7a8b9c0d1e', 'MongoDB vs PostgreSQL',
 'Comparing two popular database systems. Understand when to use document databases versus relational databases for your next project.',
 'Database', 'ba804cb9-fa14-42a5-afaf-be488742fc54', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),

('e4a57b98-4c02-0e45-a1f8-7a8b9c0d1e2f', 'Building RESTful APIs',
 'Learn the principles of REST and how to design clean, maintainable APIs. Includes best practices for versioning, error handling, and documentation.',
 'Development', '0d8fa44c-54fd-4cd0-ace9-2a7da57992de', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),

('f5b68c09-5d13-1f56-b2a9-8b9c0d1e2f3a', 'Docker in Production',
 'Running Docker containers in production requires careful planning. Learn about orchestration, monitoring, and security best practices.',
 'Technology', 'ba804cb9-fa14-42a5-afaf-be488742fc54', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),

('a6c79d10-6e24-2a67-c3b0-9c0d1e2f3a4b', 'Testing Strategies for Modern Apps',
 'Comprehensive guide to testing including unit tests, integration tests, and end-to-end tests. Learn Cypress, Jest, and JUnit best practices.',
 'Development', '0d8fa44c-54fd-4cd0-ace9-2a7da57992de', CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '6 days'),

('b7d80e21-7f35-3b78-d4c1-0d1e2f3a4b5c', 'Redis Caching Strategies',
 'Improve application performance with Redis. Learn about different caching patterns, cache invalidation, and distributed caching solutions.',
 'Database', 'ba804cb9-fa14-42a5-afaf-be488742fc54', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '7 days'),

('c8e91f32-8a46-4c89-e5d2-1e2f3a4b5c6d', 'GraphQL vs REST',
 'Understanding the differences between GraphQL and REST APIs. Learn when to use each approach and how to implement GraphQL in your stack.',
 'Technology', '0d8fa44c-54fd-4cd0-ace9-2a7da57992de', CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '8 days'),

('d9f02a43-9b57-5d90-f6e3-2f3a4b5c6d7e', 'CI/CD Pipeline Best Practices',
 'Automate your development workflow with continuous integration and deployment. Learn about GitHub Actions, Jenkins, and deployment strategies.',
 'Development', 'ba804cb9-fa14-42a5-afaf-be488742fc54', CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_TIMESTAMP - INTERVAL '9 days'),

('e0a13b54-0c68-6e01-a7f4-3a4b5c6d7e8f', 'JavaScript Performance Optimization',
 'Make your web applications faster with these JavaScript optimization techniques. Learn about lazy loading, code splitting, and memory management.',
 'Technology', '0d8fa44c-54fd-4cd0-ace9-2a7da57992de', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '10 days')
ON CONFLICT DO NOTHING;
