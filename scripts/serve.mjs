import LiveServer from "live-server";

function main() {
  LiveServer.start({
    mount: [["/", "testing/index.html"]],
  });
}

main();
