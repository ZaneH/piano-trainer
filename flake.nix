{
  description = "Rust dev env";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    {
      devShells.x86_64-linux.default =
        let
          pkgs = import nixpkgs { system = "x86_64-linux"; };
        in
        pkgs.mkShell {
          packages = with pkgs; [
            rustc
            cargo
            rustfmt
            clippy
            nodejs
            openssl
            pkg-config
            glib
            gtk3
            webkitgtk_4_1
            libsoup_3
            gdk-pixbuf
            cairo
            pango
            atk
            harfbuzz
            librsvg
            alsa-lib
            glib-networking
          ];

          LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
            pkgs.webkitgtk_4_1
            pkgs.gtk3
            pkgs.libsoup_3
            pkgs.glib
            pkgs.gdk-pixbuf
            pkgs.cairo
            pkgs.pango
            pkgs.atk
            pkgs.harfbuzz
            pkgs.librsvg
            pkgs.alsa-lib
            pkgs.openssl
            pkgs.glib-networking
          ];

          GIO_EXTRA_MODULES = "${pkgs.glib-networking}/lib/gio/modules";
        };
    };
}
