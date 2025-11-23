FROM debian:stable-slim

RUN apt-get update && \
    apt-get install -y \
      iproute2 \
      iputils-ping \
      tcpdump \
      dnsutils \
      traceroute \
      netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /tools

CMD ["bash"]
