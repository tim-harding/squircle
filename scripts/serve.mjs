import LiveServer from "live-server";

function main() {
  LiveServer.start({
    open: false,
    file: "./testing/index.html",
  });
}

main();
