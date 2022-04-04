CREATE SCHEMA threes;

BEGIN;
CREATE TABLE threes.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    owner_id character varying(36) NOT NULL REFERENCES keycloak.user_entity ON DELETE CASCADE,

    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name character varying(64) NOT NULL,
    description character varying(512) NOT NULL DEFAULT '',

    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted boolean NOT NULL DEFAULT FALSE
);

ALTER TABLE threes.tasks OWNER TO threes;
END;

CREATE INDEX tasks_owner_id_index ON threes.tasks (owner_id);

BEGIN;
CREATE TABLE threes.review_configurations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name character varying(32) NOT NULL
);

ALTER TABLE threes.review_configurations OWNER TO threes;

INSERT INTO threes.review_configurations (name) VALUES
    ('Weekly'),
    ('Monthly'),
    ('Quarterly'),
    ('Yearly');
END;
