### build asmttpd ###
FROM ubuntu:20.04 as asmttpd-builder
RUN apt update
RUN apt install -y make yasm as31 nasm binutils git
WORKDIR /build
RUN git clone https://github.com/nemasu/asmttpd.git
RUN cd asmttpd && make release

### build svelte ###
FROM node:14-alpine AS svelte-builder
WORKDIR /build
COPY . /build
RUN npm install
RUN npm run build

### run stage ###
FROM scratch
COPY --from=asmttpd-builder /build/asmttpd/asmttpd /asmttpd
COPY --from=svelte-builder /build/build /web_root
CMD ["/asmttpd", "/web_root", "80"]
