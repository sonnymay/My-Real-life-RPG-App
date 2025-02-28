import React, { useState, useEffect } from "react";
// Other imports remain
// DevTestPanel import has been removed

function RealLifeRPG() {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch player data from API
    fetch("/api/player")
      .then((response) => response.json())
      .then((data) => {
        setPlayer(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="real-life-rpg">
      <h1>Welcome, {player.name}!</h1>
      <p>Level: {player.level}</p>
      <p>Experience: {player.experience}</p>
      {/* Other components and elements */}
    </div>
  );
}

export default RealLifeRPG;
