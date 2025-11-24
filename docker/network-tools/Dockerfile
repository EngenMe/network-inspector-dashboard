FROM debian:stable-slim

RUN apt-get update && \
    apt-get install -y \
      dnsutils \
      iproute2 \
      iputils-ping \
      tcpdump \
      traceroute \
      netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /tools

CMD ["bash"]
