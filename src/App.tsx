import React from 'react';
import BoardView from './game2048/components/board';

// import { Telegraf, Markup } from 'telegraf';

// Create a bot instance with your token
// const bot = new Telegraf('8009373438:AAHlhO96EwCCBgCTjECtPeFL_Nj9qQzU7os');

const App: React.FC = () => {
  // bot.command('play', (ctx: any) => {
  //   ctx.reply(
  //     'Play 2048 in Telegram!',
  //     Markup.inlineKeyboard([
  //       Markup.button.webApp('▶️ Play 2048', 'https://fun-game-pool.vercel.app/')
  //     ])
  //   );
  // });
  
  // // Start the bot
  // bot.launch();

  
  return (
    <div>
      <h1>2048</h1>
      <BoardView />
    </div>
  );
}

export default App;