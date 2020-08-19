.PHONY: docker-build docker-run

docker-build:
	@docker build -t ekos-web .

docker-run:
	@docker run -p 3000:3000 -it ekos-web
