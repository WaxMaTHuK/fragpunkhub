CREATE TABLE `material_reads` (
  `user_id` text NOT NULL,
  `post_id` text NOT NULL,
  `read_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY(`user_id`, `post_id`)
);
--> statement-breakpoint
CREATE INDEX `material_reads_user_id_read_at_index` ON `material_reads` (`user_id`, `read_at`);
