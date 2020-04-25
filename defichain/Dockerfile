ARG VERSION=1.0.0-alpha1 

FROM ubuntu:20.04 as builder
ARG VERSION

ENV DFI_PKG_FILE=defichain-${VERSION}-x86_64-pc-linux-gnu.tar.gz
ENV DFI_PKG_URL=https://github.com/DeFiCh/ain/releases/download/v${VERSION}/${DFI_PKG_FILE}

WORKDIR /work

RUN apt update && apt install wget -y

RUN wget ${DFI_PKG_URL} && \
    ls -lh ${DFI_PKG_FILE} && \
    tar -xvzf ${DFI_PKG_FILE}

### End of build ###

FROM ubuntu:20.04
ARG VERSION

VOLUME [ "/data" ]
VOLUME [ "/root/.defi/defi.conf" ]

WORKDIR /app
COPY --from=builder /work/defichain-${VERSION}/. .

EXPOSE 8555 8554 18555 18554 19555 19554

CMD ["/app/bin/defid"]