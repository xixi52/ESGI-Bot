-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : dim. 02 oct. 2022 à 10:52
-- Version du serveur : 10.9.3-MariaDB-1:10.9.3+maria~deb10
-- Version de PHP : 8.1.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `esgi`
--

-- --------------------------------------------------------

--
-- Structure de la table `autorole_channel`
--

CREATE TABLE `autorole_channel` (
  `id` int(11) NOT NULL,
  `channel` varchar(19) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `autorole_role`
--

CREATE TABLE `autorole_role` (
  `id` int(11) NOT NULL,
  `role_id` varchar(19) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `channel_id` varchar(19) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `autorole_channel`
--
ALTER TABLE `autorole_channel`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `autorole_role`
--
ALTER TABLE `autorole_role`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `autorole_channel`
--
ALTER TABLE `autorole_channel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `autorole_role`
--
ALTER TABLE `autorole_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
