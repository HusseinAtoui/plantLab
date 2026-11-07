
"use client";

import { useState, type FormEvent } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setMessage("Please select a plant photo first.");
      return;
    }

    setMessage(
      "Your photo is ready! Plant identification will be connected next."
    );
  }

  return (
    <main className="min-h-screen overflow-hidden">

      {/* NAVIGATION */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">

        <a href="#" className="flex items-center gap-2">
          <span className="text-3xl text-[#234b35]">✳</span>
          <span className="text-2xl font-semibold tracking-tight text-[#234b35]">
            PlantLab
          </span>
        </a>

        <div className="hidden items-center gap-10 text-sm text-[#59675a] md:flex">
          <a href="#" className="transition hover:text-[#234b35]">
            Home
          </a>
          <a href="#identify" className="transition hover:text-[#234b35]">
            Identify a plant
          </a>
          <a href="#how-it-works" className="transition hover:text-[#234b35]">
            How it works
          </a>
        </div>

        <a
          href="#identify"
          className="rounded-full bg-[#234b35] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#183b29]"
        >
          Get started <span className="ml-1">↗</span>
        </a>

      </nav>


      {/* HERO SECTION */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-12 md:grid-cols-2 lg:px-10 lg:pb-32 lg:pt-20">

        <div className="max-w-xl">

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#dce5d8] bg-[#edf2e9] px-4 py-2 text-xs font-medium tracking-wide text-[#42654b]">
            <span className="h-2 w-2 rounded-full bg-[#648d64]" />
            YOUR PERSONAL PLANT DISCOVERY TOOL
          </div>

          <h1 className="text-5xl leading-[1.12] tracking-tight text-[#234b35] sm:text-6xl lg:text-7xl">
            Every plant has a story.
            <span className="mt-2 block font-serif italic text-[#82977a]">
              Discover yours.
            </span>
          </h1>

          <p className="mt-7 max-w-md text-base leading-8 text-[#777f75]">
            Curious about that plant you found? Discover its name,
            explore its details, and get to know the greenery around you.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">

            <a
              href="#identify"
              className="rounded-full bg-[#234b35] px-8 py-4 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#183b29]"
            >
              Identify a plant <span className="ml-2">↗</span>
            </a>

            <a
              href="#how-it-works"
              className="px-4 py-3 text-sm font-medium text-[#526653] transition hover:text-[#234b35]"
            >
              Learn more
            </a>

          </div>

          <div className="mt-14 flex items-center gap-4 border-t border-[#e5e8df] pt-7">

            <div className="flex -space-x-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f8f8f3] bg-[#dce7d8] text-lg">
                🌱
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f8f8f3] bg-[#e8dfce] text-lg">
                🌿
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f8f8f3] bg-[#d9e4df] text-lg">
                🍃
              </span>
            </div>

            <p className="text-xs leading-5 text-[#777f75]">
              A little curiosity goes a long way.
              <br />
              Start exploring the botanical world.
            </p>

          </div>

        </div>


        {/* HERO IMAGE */}
        <div className="relative mx-auto w-full max-w-lg">

          <div className="absolute -right-5 -top-5 h-40 w-40 rounded-full bg-[#e5ebdc]" />

          <div
            role="img"
            aria-label="A collection of beautiful green indoor plants"
            className="relative h-[430px] overflow-hidden rounded-[48%_48%_12px_12px] bg-cover bg-center shadow-xl sm:h-[540px]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=85')",
            }}
          />

          <div className="absolute -bottom-6 -left-5 rounded-2xl border border-[#e5e8df] bg-white p-5 shadow-lg sm:-left-10">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf2e9] text-xl">
                🌿
              </div>

              <div>
                <p className="text-sm font-semibold text-[#234b35]">
                  Nature is closer
                </p>
                <p className="mt-1 text-xs text-[#899187]">
                  than you think.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* IDENTIFICATION SECTION */}
      <section
        id="identify"
        className="bg-[#edf2e9] px-6 py-24 lg:px-10 lg:py-28"
      >

        <div className="mx-auto max-w-4xl">

          <div className="mb-12 text-center">

            <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-[#82977a]">
              PLANT IDENTIFICATION
            </p>

            <h2 className="font-serif text-4xl tracking-tight text-[#234b35] sm:text-5xl">
              What are we growing?
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#777f75]">
              Upload a photo of a plant and let PlantLab help you
              discover what it is.
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#dce5d8] bg-white p-6 shadow-sm sm:p-10"
          >

            <label
              htmlFor="plant-image"
              className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cbd8c7] bg-[#fafbf8] px-6 py-12 text-center transition hover:border-[#82977a] hover:bg-[#f4f7f1]"
            >

              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8efe4] text-3xl">
                📷
              </div>

              <h3 className="text-lg font-semibold text-[#234b35]">
                {selectedFile ? "Photo selected!" : "Drop your plant photo here"}
              </h3>

              <p className="mt-2 text-sm text-[#899187]">
                Or click to browse your files
              </p>

              <span className="mt-5 rounded-full bg-[#234b35] px-6 py-3 text-xs font-medium text-white">
                Choose a photo
              </span>

              <input
                id="plant-image"
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(event) => {
                  setSelectedFile(event.target.files?.[0] ?? null);
                  setMessage("");
                }}
              />

            </label>


            {selectedFile && (
              <p className="mt-4 break-all text-center text-sm text-[#526653]">
                Selected: {selectedFile.name}
              </p>
            )}


            <button
              type="submit"
              disabled={!selectedFile}
              className="mt-6 w-full rounded-full bg-[#234b35] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#183b29] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Identify my plant <span className="ml-2">↗</span>
            </button>

            {message && (
              <p
                role="status"
                className="mt-4 text-center text-sm text-[#526653]"
              >
                {message}
              </p>
            )}

            <p className="mt-5 text-center text-xs text-[#9a9f96]">
              Supported image formats depend on your browser.
            </p>

          </form>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"
      >

        <div className="mb-16 text-center">

          <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-[#82977a]">
            SIMPLE AS ONE, TWO, THREE
          </p>

          <h2 className="font-serif text-4xl tracking-tight text-[#234b35] sm:text-5xl">
            A little nature, a little technology.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#777f75]">
            Getting to know the plants around you has never been easier.
          </p>

        </div>


        <div className="grid gap-12 md:grid-cols-3">

          <div className="text-center">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#edf2e9] text-3xl">
              📸
            </div>

            <span className="text-xs font-semibold tracking-widest text-[#82977a]">
              STEP 01
            </span>

            <h3 className="mt-3 text-xl font-semibold text-[#234b35]">
              Take a photo
            </h3>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-[#777f75]">
              Find a plant that catches your eye and upload a clear photo.
            </p>

          </div>


          <div className="text-center">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#edf2e9] text-3xl">
              🔍
            </div>

            <span className="text-xs font-semibold tracking-widest text-[#82977a]">
              STEP 02
            </span>

            <h3 className="mt-3 text-xl font-semibold text-[#234b35]">
              Let us identify it
            </h3>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-[#777f75]">
              PlantLab analyzes your photo to find possible plant matches.
            </p>

          </div>


          <div className="text-center">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#edf2e9] text-3xl">
              🌱
            </div>

            <span className="text-xs font-semibold tracking-widest text-[#82977a]">
              STEP 03
            </span>

            <h3 className="mt-3 text-xl font-semibold text-[#234b35]">
              Explore and learn
            </h3>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-[#777f75]">
              Discover the plant's name and learn more about its world.
            </p>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="bg-[#234b35] px-6 py-12 text-white lg:px-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row sm:items-center">

          <div>
            <a href="#" className="flex items-center gap-2">
              <span className="text-2xl">✳</span>
              <span className="text-xl font-semibold">PlantLab</span>
            </a>

            <p className="mt-3 text-xs text-[#c1d0c1]">
              Discover more. Grow curious.
            </p>
          </div>

          <div className="flex gap-6 text-xs text-[#d4dfd2]">
            <a href="#identify" className="transition hover:text-white">
              Identify a plant
            </a>
            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>
          </div>

        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/15 pt-6">
          <p className="text-xs text-[#c1d0c1]">
            © {new Date().getFullYear()} PlantLab. Made with curiosity and a little love for nature.
          </p>
        </div>

      </footer>

    </main>
  );
}
