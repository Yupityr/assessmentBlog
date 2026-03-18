import Blogcard from "./Blogcard";


const Homepage = () => {

  return (
    <main className="flex flex-col min-h-[75vh] max-w-2xl mx-auto">
      <section className="text-xs items-start font-bold px-5">
        <h1 className=" header-text my-2">Recent Posts</h1>
      </section>
      <Blogcard />
    </main>
  );
};

export default Homepage;
