-- CreateTable
CREATE TABLE `MonthlyLimit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `month` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,

    UNIQUE INDEX `MonthlyLimit_userId_month_key`(`userId`, `month`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MonthlyLimit` ADD CONSTRAINT `MonthlyLimit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
