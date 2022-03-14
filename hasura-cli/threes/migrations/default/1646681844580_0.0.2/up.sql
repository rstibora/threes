CREATE SCHEMA threes;

ALTER TABLE threes.users OWNER TO threes;

BEGIN;
CREATE TABLE threes.tasks (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    owner_id character varying(36) REFERENCES keycloak.user_entity ON DELETE CASCADE,

    created timestamp with time zone NOT NULL,
    name character varying(64) NOT NULL,
    description character varying(512) NOT NULL
);

ALTER TABLE threes.tasks OWNER TO threes;
COMMIT;

CREATE INDEX tasks_owner_id_index ON threes.tasks (owner_id);

BEGIN;
CREATE TABLE threes.review_configurations (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name character varying(64) NOT NULL
);

ALTER TABLE threes.review_configurations OWNER TO threes;

INSERT INTO threes.review_configurations (name) VALUES
    ('Weekly'),
    ('Monthly'),
    ('Quarterly'),
    ('Yearly');
END;
