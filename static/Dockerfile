# syntax=docker/dockerfile:1
ARG git_hash=undefined
ARG git_tag=undefined
ARG image_tag=latest
FROM rstibora/threes-frontend:${image_tag} as frontend-image
FROM rstibora/threes-backend:${image_tag} as backend-image
FROM nginx

ENV GIT_HASH=${git_hash}
ENV GIT_TAG=${git_tag}

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend-image /output /etc/nginx/html/static
COPY --from=backend-image /static /etc/nginx/html/static
