import { Link } from "react-router-dom";
import Button from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export const Landing = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section
        className="relative text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/djvdenkly/image/upload/v1761917188/homepage_js3v2k.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" /> {/* dark overlay for contrast */}
        <div className="relative max-w-7xl mx-auto px-1 text-left">
          <h1 className="text-2xl md:text-5xl font-bold mb-1">Welcome to LU League</h1>
          <p className="text-lg md:text-xl mb-8">
            Track your favorite teams, players, and matches all in one place.
          </p>
          <div className="flex justify-left gap-4">
            <Link to="/standings">
              <Button variant="default">View Standings</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">Join Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
          </CardHeader>
          <CardContent>
            {/* You can map recent matches here */}
            <p>Match 1: Team A vs Team B</p>
            <p>Match 2: Team C vs Team D</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Team A</p>
            <p>Team B</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Players</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Player 1</p>
            <p>Player 2</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
