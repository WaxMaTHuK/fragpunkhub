CREATE TABLE `profiles` (
  `user_id` text PRIMARY KEY NOT NULL,
  `nickname` text DEFAULT 'Лансер' NOT NULL,
  `avatar` text DEFAULT '⚡' NOT NULL,
  `frame` text DEFAULT 'acid' NOT NULL,
  `game_rank` text DEFAULT 'Новичок' NOT NULL,
  `level` integer DEFAULT 1 NOT NULL,
  `xp` integer DEFAULT 0 NOT NULL,
  `articles_read` integer DEFAULT 0 NOT NULL,
  `videos_watched` integer DEFAULT 0 NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);