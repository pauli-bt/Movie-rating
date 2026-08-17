import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const P = (seed: string) =>
  `https://images.unsplash.com/${seed}?w=600&h=900&fit=crop`;

async function main() {
  console.log("Seeding…");

  const artists = await Promise.all(
    [
      { name: "Haile Gerima", role: "director" as const, bio: "Ethiopian filmmaker known for Harvest: 3,000 Years and Teza." },
      { name: "Yidnekachew Shumete", role: "director" as const, bio: "Director and producer, chair of the Ethiopian Film Initiative." },
      { name: "Hermon Hailay", role: "director" as const, bio: "Director of Price of Love and Sons of Adam." },
      { name: "Selam Tesfaye", role: "actor" as const, bio: "Actress known for leading roles across Ethiopian drama films." },
      { name: "Girum Ermias", role: "actor" as const, bio: "Screen and stage actor based in Addis Ababa." },
      { name: "Meron Getnet", role: "actor" as const, bio: "Actress and stage performer, known for Difret." },
      { name: "Tewodros \"Teddy Afro\" Kassahun", role: "actor" as const, bio: "Musician and occasional film performer." },
      { name: "Ephrem Solomon", role: "director" as const, bio: "Visual artist and short-film director." },
      { name: "Sew Le Sew Studios", role: "studio" as const, bio: "Independent Addis Ababa production studio." },
      { name: "Kana Films", role: "studio" as const, bio: "Production studio behind several recent Ethiopian features." },
      { name: "Wanuri Kahiu", role: "director" as const, bio: "Kenyan filmmaker, director of Rafiki and Pumzi." },
      { name: "Mo Abudu", role: "studio" as const, bio: "Nigerian media executive, founder of EbonyLife Studios." },
    ].map((a) => prisma.artist.create({ data: a }))
  );

  const byName = (n: string) => artists.find((a) => a.name === n)!;

  const movies = await Promise.all(
    [
      {
        title: "Teza",
        description:
          "An Ethiopian intellectual returns home after years abroad and confronts the country he left behind.",
        genre: "Drama",
        duration: 140,
        language: "Amharic",
        country: "Ethiopia",
        releaseDate: new Date("2008-09-01"),
        poster: P("photo-1489599849927-2ee91cede3ba"),
      },
      {
        title: "Difret",
        description:
          "A young lawyer defends a 14-year-old girl accused of murder after escaping a forced marriage.",
        genre: "Drama",
        duration: 99,
        language: "Amharic",
        country: "Ethiopia",
        releaseDate: new Date("2014-01-19"),
        poster: P("photo-1440404653325-ab127d49abc1"),
      },
      {
        title: "Price of Love",
        description:
          "A taxi driver in Addis Ababa falls for a woman with a hidden double life.",
        genre: "Drama",
        duration: 105,
        language: "Amharic",
        country: "Ethiopia",
        releaseDate: new Date("2015-09-01"),
        poster: P("photo-1478720568477-152d9b164e26"),
      },
      {
        title: "Harvest: 3,000 Years",
        description:
          "A landmark portrait of a peasant family's life under Ethiopia's feudal land system.",
        genre: "Drama",
        duration: 150,
        language: "Amharic",
        country: "Ethiopia",
        releaseDate: new Date("1976-01-01"),
        poster: P("photo-1500462918059-b1a0cb512f1d"),
      },
      {
        title: "Sons of Adam",
        description:
          "Two brothers in rural Ethiopia navigate rivalry and reconciliation across a single harvest season.",
        genre: "Drama",
        duration: 110,
        language: "Amharic",
        country: "Ethiopia",
        releaseDate: new Date("2022-06-01"),
        poster: P("photo-1517602302552-471fe67acf66"),
      },
      {
        title: "Rafiki",
        description:
          "Two young women in Nairobi fall in love despite family and political pressure.",
        genre: "Drama",
        duration: 83,
        language: "Swahili",
        country: "Kenya",
        releaseDate: new Date("2018-05-09"),
        poster: P("photo-1496317556649-f930d733eea3"),
      },
      {
        title: "Pumzi",
        description:
          "In a drought-stricken future East Africa, a museum curator risks everything to prove life outside is possible.",
        genre: "Sci-Fi",
        duration: 21,
        language: "English",
        country: "Kenya",
        releaseDate: new Date("2009-01-01"),
        poster: P("photo-1446776877081-d282a0f896e2"),
      },
      {
        title: "Chief Daddy",
        description:
          "A wealthy patriarch's death sends his sprawling family scrambling over the inheritance.",
        genre: "Comedy",
        duration: 105,
        language: "English",
        country: "Nigeria",
        releaseDate: new Date("2018-12-21"),
        poster: P("photo-1440404653325-ab127d49abc1"),
      },
      {
        title: "Fig Tree",
        description:
          "During the Ethiopian civil war, a Jewish teenager hides her Christian boyfriend as her family prepares to flee to Israel.",
        genre: "Drama",
        duration: 93,
        language: "Amharic",
        country: "Ethiopia",
        releaseDate: new Date("2018-09-09"),
        poster: P("photo-1508614999368-9260051292e5"),
      },
      {
        title: "Sabriye",
        description:
          "The true story of a blind Ethiopian woman who fought for the rights of blind children.",
        genre: "Biography",
        duration: 100,
        language: "Amharic",
        country: "Ethiopia",
        releaseDate: new Date("2007-01-01"),
        poster: P("photo-1517841905240-472988babdf9"),
      },
      {
        title: "Lamb",
        description:
          "A boy in rural Ethiopia forms a deep bond with his pet sheep, resisting pressure to sacrifice it.",
        genre: "Drama",
        duration: 94,
        language: "Amharic",
        country: "Ethiopia",
        releaseDate: new Date("2015-05-18"),
        poster: P("photo-1521133573892-e44906baee46"),
      },
      {
        title: "Running Against the Wind",
        description:
          "Two childhood friends in the Ethiopian highlands chase different dreams — one running, one behind the camera.",
        genre: "Drama",
        duration: 105,
        language: "Amharic",
        country: "Ethiopia",
        releaseDate: new Date("2019-09-06"),
        poster: P("photo-1500534623283-312aade485b7"),
      },
      {
        title: "Min Alesh?",
        description:
          "A comedy of errors set across a single chaotic wedding weekend in Addis Ababa.",
        genre: "Comedy",
        duration: 98,
        language: "Amharic",
        country: "Ethiopia",
        releaseDate: new Date("2021-03-01"),
        poster: P("photo-1478720568477-152d9b164e26"),
      },
      {
        title: "October 1",
        description:
          "A detective investigates a child's murder in 1930s colonial Nigeria as independence movements stir.",
        genre: "Thriller",
        duration: 130,
        language: "English",
        country: "Nigeria",
        releaseDate: new Date("2014-10-01"),
        poster: P("photo-1489599849927-2ee91cede3ba"),
      },
      {
        title: "The Athlete",
        description:
          "A dramatization of the life of Abebe Bikila, the barefoot Ethiopian marathon champion.",
        genre: "Biography",
        duration: 90,
        language: "Amharic",
        country: "Ethiopia",
        releaseDate: new Date("2009-01-01"),
        poster: P("photo-1461896836934-ffe607ba8211"),
      },
      {
        title: "Kereb",
        description:
          "A family drama unfolding across three generations in the Tigray highlands.",
        genre: "Drama",
        duration: 108,
        language: "Tigrinya",
        country: "Ethiopia",
        releaseDate: new Date("2013-01-01"),
        poster: P("photo-1500462918059-b1a0cb512f1d"),
      },
      {
        title: "Kabisha",
        description:
          "A young Addis Ababa entrepreneur risks his family's savings on a startup nobody believes in.",
        genre: "Drama",
        duration: 100,
        language: "Amharic",
        country: "Ethiopia",
        releaseDate: new Date("2020-11-01"),
        poster: P("photo-1517602302552-471fe67acf66"),
      },
      {
        title: "Under the Constellations",
        description:
          "An anthology of short love stories set across a single rainy season in Addis Ababa.",
        genre: "Romance",
        duration: 95,
        language: "Amharic",
        country: "Ethiopia",
        releaseDate: new Date("2017-02-14"),
        poster: P("photo-1496317556649-f930d733eea3"),
      },
    ].map((m) => prisma.movie.create({ data: m }))
  );

  const byTitle = (t: string) => movies.find((m) => m.title === t)!;

  const cast: { movie: string; artist: string; role: "actor" | "director" | "producer"; character?: string }[] = [
    { movie: "Teza", artist: "Haile Gerima", role: "director" },
    { movie: "Difret", artist: "Meron Getnet", role: "actor", character: "Meaza Ashenafi" },
    { movie: "Price of Love", artist: "Hermon Hailay", role: "director" },
    { movie: "Price of Love", artist: "Girum Ermias", role: "actor" },
    { movie: "Harvest: 3,000 Years", artist: "Haile Gerima", role: "director" },
    { movie: "Sons of Adam", artist: "Hermon Hailay", role: "director" },
    { movie: "Sons of Adam", artist: "Selam Tesfaye", role: "actor" },
    { movie: "Rafiki", artist: "Wanuri Kahiu", role: "director" },
    { movie: "Pumzi", artist: "Wanuri Kahiu", role: "director" },
    { movie: "Chief Daddy", artist: "Mo Abudu", role: "producer" },
    { movie: "Fig Tree", artist: "Meron Getnet", role: "actor" },
    { movie: "Sabriye", artist: "Selam Tesfaye", role: "actor" },
    { movie: "Lamb", artist: "Yidnekachew Shumete", role: "director" },
    { movie: "Running Against the Wind", artist: "Girum Ermias", role: "actor" },
    { movie: "Min Alesh?", artist: "Ephrem Solomon", role: "director" },
    { movie: "Min Alesh?", artist: "Selam Tesfaye", role: "actor" },
    { movie: "October 1", artist: "Mo Abudu", role: "producer" },
    { movie: "The Athlete", artist: "Yidnekachew Shumete", role: "director" },
    { movie: "Kereb", artist: "Ephrem Solomon", role: "director" },
    { movie: "Kabisha", artist: "Girum Ermias", role: "actor" },
    { movie: "Under the Constellations", artist: "Meron Getnet", role: "actor" },
  ];

  await Promise.all(
    cast.map((c) =>
      prisma.movieCast.create({
        data: {
          movieId: byTitle(c.movie).id,
          artistId: byName(c.artist).id,
          role: c.role,
          characterName: c.character,
        },
      })
    )
  );

  console.log(`Seeded ${movies.length} movies and ${artists.length} artists.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
