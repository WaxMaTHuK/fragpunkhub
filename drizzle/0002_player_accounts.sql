CREATE TABLE `player_accounts` (
 `id` text PRIMARY KEY NOT NULL,
 `email` text NOT NULL,
 `password_hash` text NOT NULL,
 `password_salt` text NOT NULL,
 `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `player_accounts_email_unique` ON `player_accounts` (`email`);
--> statement-breakpoint
CREATE TABLE `player_sessions` (
 `token` text PRIMARY KEY NOT NULL,
 `user_id` text NOT NULL,
 `expires_at` text NOT NULL,
 `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `player_sessions_user_id_index` ON `player_sessions` (`user_id`);