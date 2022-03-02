-- liquibase formatted sql

-- changeset threes:1
CREATE SCHEMA threes;
-- rollback DROP SCHEMA threes;

-- changeset threes:2
CREATE TABLE threes.users (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY
);

ALTER TABLE threes.users OWNER TO threes;
-- rollback DROP TABLE threes.users;

-- changeset threes:3
BEGIN;
CREATE TABLE threes.tasks (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    owner_id bigint REFERENCES threes.users ON DELETE CASCADE,

    created timestamp with time zone NOT NULL,
    name character varying(64) NOT NULL,
    description character varying(512) NOT NULL
);

ALTER TABLE threes.tasks OWNER TO threes;
COMMIT;
-- rollback DROP TABLE threes.tasks;

-- changeset threes:4
CREATE INDEX tasks_owner_id_index ON threes.tasks (owner_id);
-- rollback DROP INDEX tasks_owner_id_index;

-- changeset threes:5
BEGIN;
CREATE TABLE threes.review_configurations (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name character varying(64) NOT NULL
);

INSERT INTO threes.review_configurations (name) VALUES
    ('Weekly'),
    ('Monthly'),
    ('Quarterly'),
    ('Yearly');
END;
-- rollback DROP TABLE threes.review_configurations;
