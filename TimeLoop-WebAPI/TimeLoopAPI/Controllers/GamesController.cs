using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

public record StoryPart(int Part, string Text, string Picture);

public class StoryResponse
{
    public List<StoryPart>? Story { get; set; }
}

[Route("api/story")]
[ApiController]
public class StoryController : ControllerBase
{
    private readonly List<StoryPart> story;

    public StoryController()
    {
        story = new List<StoryPart>
        {
            new StoryPart(0, "Dr. Victor Malachi, a brilliant scientist, had dedicated his life to unraveling the mysteries of time travel for his employer the US Government. In a secret underground laboratory, hidden away from the prying eyes of the world, he toiled day and night to perfect his creation, a groundbreaking time machine.", "images/intro1.jpg"),
            new StoryPart(1, "As Dr. Malachi conducted experiments becoming more drawn into the idea of power his discoveries could wield and disregarding the warnings of his colleagues, he stumbled upon a dark secret: a rift in the fabric of time itself. Instead of heeding caution, he saw this as an opportunity to harness unimaginable power.", "images/intro2.jpg"),
            new StoryPart(2, "With a maniacal glint in his eye, he modified the time machine to exploit the rift's energy, intending to control time itself.", "images/intro3.jpg"),
            new StoryPart(3, "As he activated the modified device, a surge of energy coursed through the laboratory. The air crackled with an ominous electricity as the time machine whirred to life.", "images/intro4.jpg"),
            new StoryPart(4, "As the time machine reached its peak, the rift expanded uncontrollably, creating a chaotic temporal storm. Reality itself began to warp and twist, tearing at the seams.", "images/intro5.jpg"),
            new StoryPart(5, "Dr. Malachi's walks towards a force he had unleashed far beyond his comprehension. The temporal storm grew more intense, folding in on itself. The laboratory started to crumble around the scientists, and time itself seemed to fracture.", "images/intro6.jpg")
        };
    }

    [HttpGet]
    public ActionResult<StoryResponse> GetStory()
    {
        var response = new StoryResponse { Story = story };
        return Ok(response);
    }
}





/*
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;



namespace GameStoreApi.Controllers
{
    [ApiController]
    [Route("api/games")]
    public class GamesController : ControllerBase
    {
        private readonly List<Game> games = new List<Game>
        {
            new Game("Super Mario 64", "Join Mario in his 3D adventure to rescue Princess Peach from Bowser's clutches.", 19.99, "Nintendo 64", 94, "https://cdn.mobygames.com/c14a9e6c-aba3-11ed-a519-02420a00019d.webp"),
            new Game("The Legend of Zelda: Ocarina of Time", "Embark on a legendary quest as Link to stop Ganondorf and save Hyrule.", 24.99, "Nintendo 64", 99,"https://cdn.mobygames.com/d4e20cc8-abbf-11ed-8048-02420a000198.webp"),
            new Game("Final Fantasy VII", "Experience the epic journey of Cloud Strife and his allies to stop Sephiroth and save the planet.", 29.99, "PlayStation", 92,"https://cdn.mobygames.com/8ecdaa56-abad-11ed-87d1-02420a000197.webp"),
            new Game("Metal Gear Solid", "Infiltrate Shadow Moses Island and thwart the plans of the rogue terrorist group, FOXHOUND.", 17.99, "PlayStation", 94,"https://cdn.mobygames.com/13916026-aba8-11ed-9e47-02420a00019f.webp"),
            new Game("Resident Evil 2", "Survive a zombie apocalypse in Raccoon City as Leon Kennedy and Claire Redfield.", 14.99, "PlayStation", 89,"https://cdn.mobygames.com/ad18226c-abac-11ed-93d8-02420a000198.webp"),
            new Game("Half-Life", "Experience a groundbreaking first-person shooter as Gordon Freeman in the mysterious Black Mesa research facility.", 19.99, "PC", 96,"https://cdn.mobygames.com/455b871a-abb9-11ed-aecf-02420a000198.webp"),
            // Add more games here
        };

        [HttpGet]
        public IActionResult GetGames()
        {
            return Ok(games);
        }
    }

    record Game(
        string Title,
        string Description,
        double Price,
        string Console,
        int Metacritic,
        string Image
    );
}
*/