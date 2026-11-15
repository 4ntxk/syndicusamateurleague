import fs from "node:fs";
import path from "node:path";

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  PermissionFlagsBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";

import { getDiscordConfig } from "./discord-lib.mjs";

const config = getDiscordConfig();
const dataPath = (...parts) => path.resolve(process.cwd(), ...parts);
const seasonPath = dataPath("src", "data", "fc27-season-1-players.json");
const fixturesPath = dataPath("src", "data", "fc27-season-1-week-1.json");
const runtimeDirectory = dataPath(".discord-data");
const reportsPath = path.join(runtimeDirectory, "fc27-reports.json");

fs.mkdirSync(runtimeDirectory, { recursive: true });
if (!fs.existsSync(reportsPath)) {
  fs.writeFileSync(reportsPath, '{"reports":[]}\n', "utf8");
}

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const readReports = () => readJson(reportsPath);
const writeReports = (data) =>
  fs.writeFileSync(reportsPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

const addDivisionOption = (command) =>
  command.addStringOption((option) =>
    option
      .setName("division")
      .setDescription("FC27 division")
      .addChoices(
        { name: "Platinum", value: "Platinum" },
        { name: "Gold", value: "Gold" },
        { name: "Silver", value: "Silver" },
      ),
  );

const commands = [
  new SlashCommandBuilder()
    .setName("sal-status")
    .setDescription("Check the SAL League Manager status."),
  new SlashCommandBuilder()
    .setName("sal-help")
    .setDescription("Show the available SAL commands and how to use them."),
  new SlashCommandBuilder()
    .setName("sal-audit")
    .setDescription("Show how to run the read-only Discord audit.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  addDivisionOption(
    new SlashCommandBuilder()
      .setName("fc27-roster")
      .setDescription("Show the FC27 Season 1 roster."),
  ),
  addDivisionOption(
    new SlashCommandBuilder()
      .setName("fc27-fixtures")
      .setDescription("Show FC27 Week 1 fixtures."),
  ),
  new SlashCommandBuilder()
    .setName("fc27-report")
    .setDescription("Report an FC27 Week 1 result.")
    .addStringOption((option) =>
      option
        .setName("fixture")
        .setDescription("Fixture ID, for example W1-PLATINUM-01")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("my-goals")
        .setDescription("Your final score")
        .setMinValue(0)
        .setMaxValue(99)
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("opponent-goals")
        .setDescription("Your opponent's final score")
        .setMinValue(0)
        .setMaxValue(99)
        .setRequired(true),
    )
    .addAttachmentOption((option) =>
      option
        .setName("screenshot")
        .setDescription("Final-score screenshot")
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("fc27-test-report")
    .setDescription("Create a safe organiser-only FC27 result test.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addIntegerOption((option) =>
      option
        .setName("my-goals")
        .setDescription("Your test score")
        .setMinValue(0)
        .setMaxValue(99)
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("opponent-goals")
        .setDescription("The test opponent's score")
        .setMinValue(0)
        .setMaxValue(99)
        .setRequired(true),
    )
    .addAttachmentOption((option) =>
      option
        .setName("screenshot")
        .setDescription("Any image used only for the test")
        .setRequired(true),
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(config.token);
await rest.put(
  Routes.applicationGuildCommands(config.applicationId, config.guildId),
  { body: commands },
);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`SAL League Manager connected as ${readyClient.user.tag}.`);
});

const reportButtons = (reportId, disabled = false) =>
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`fc27-confirm:${reportId}`)
      .setLabel("Confirm result")
      .setStyle(ButtonStyle.Success)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId(`fc27-dispute:${reportId}`)
      .setLabel("Dispute")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled),
  );

const reportEmbed = (report) =>
  new EmbedBuilder()
    .setTitle(
      `${report.fixtureId} · ${report.homeUsername} ${report.homeGoals}–${report.awayGoals} ${report.awayUsername}`,
    )
    .setColor(
      report.status === "confirmed"
        ? 0x10b981
        : report.status === "disputed"
          ? 0xef4444
          : 0xf59e0b,
    )
    .setDescription(
      `Status: **${report.status.toUpperCase()}**\nReported by <@${report.reporterUserId}>. Confirmation required from <@${report.opponentUserId}>.`,
    )
    .setImage(report.screenshotUrl)
    .setFooter({ text: `SAL FC27 report ${report.id}` })
    .setTimestamp(new Date(report.createdAt));

const replyLines = async (interaction, lines) => {
  const chunks = [];
  for (let index = 0; index < lines.length; index += 20) {
    chunks.push(lines.slice(index, index + 20).join("\n"));
  }
  await interaction.reply({
    content: chunks.shift() || "No entries.",
    ephemeral: true,
  });
  for (const chunk of chunks) {
    await interaction.followUp({ content: chunk, ephemeral: true });
  }
};

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isButton()) {
      const [action, reportId] = interaction.customId.split(":");
      if (!action?.startsWith("fc27-") || !reportId) return;
      const data = readReports();
      const report = data.reports.find(
        (candidate) => candidate.id === reportId,
      );

      if (!report || interaction.user.id !== report.opponentUserId) {
        await interaction.reply({
          content: "Only the opponent may review this result.",
          ephemeral: true,
        });
        return;
      }
      if (report.status !== "pending") {
        await interaction.reply({
          content: `This result is already ${report.status}.`,
          ephemeral: true,
        });
        return;
      }

      report.status = action === "fc27-confirm" ? "confirmed" : "disputed";
      report.reviewedAt = new Date().toISOString();
      report.reviewedByUserId = interaction.user.id;
      writeReports(data);
      await interaction.update({
        embeds: [reportEmbed(report)],
        components: [reportButtons(report.id, true)],
        allowedMentions: { parse: [] },
      });
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "sal-status") {
      await interaction.reply({
        content: "SAL League Manager is online and ready.",
        ephemeral: true,
      });
      return;
    }
    if (interaction.commandName === "sal-help") {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("SAL League Manager commands")
            .setColor(0x8b5cf6)
            .setDescription(
              "Commands work anywhere on the SAL server. Start typing `/` and select SAL League Manager.",
            )
            .addFields(
              {
                name: "General",
                value:
                  "`/sal-help` — show this guide\n`/sal-status` — check whether the bot is online",
              },
              {
                name: "FC27",
                value:
                  "`/fc27-roster [division]` — view registered players\n`/fc27-fixtures [division]` — view Week 1 fixtures\n`/fc27-report` — report a result with a screenshot",
              },
              {
                name: "How to report a result",
                value:
                  "Use the exact fixture ID from `/fc27-fixtures`. Enter your score, the opponent's score and attach the final-score screenshot. The opponent then confirms or disputes the report.",
              },
              {
                name: "Need assistance?",
                value:
                  "Use `#fc27-support`, `#lol-support` or `#questions`. Never post passwords, account credentials or private personal information.",
              },
            ),
        ],
        ephemeral: true,
      });
      return;
    }
    if (interaction.commandName === "sal-audit") {
      await interaction.reply({
        content: "Run `npm run discord:audit` in the SAL project.",
        ephemeral: true,
      });
      return;
    }
    if (interaction.commandName === "fc27-roster") {
      const division = interaction.options.getString("division");
      const players = readJson(seasonPath).players.filter(
        (player) => !division || player.division === division,
      );
      await replyLines(
        interaction,
        players.map(
          (player) =>
            `**${player.division}** · ${player.discordUserId ? `<@${player.discordUserId}>` : player.discordUsername} · EA ID: ${player.eaId}`,
        ),
      );
      return;
    }
    if (interaction.commandName === "fc27-fixtures") {
      const division = interaction.options.getString("division");
      const fixtures = readJson(fixturesPath).fixtures.filter(
        (fixture) => !division || fixture.division === division,
      );
      await replyLines(
        interaction,
        fixtures.map(
          (fixture) =>
            `**${fixture.id}** · ${fixture.homeDiscordUsername} vs ${fixture.awayDiscordUsername}`,
        ),
      );
      return;
    }
    if (interaction.commandName === "fc27-test-report") {
      await interaction.deferReply({ ephemeral: true });
      const myGoals = interaction.options.getInteger("my-goals", true);
      const opponentGoals = interaction.options.getInteger(
        "opponent-goals",
        true,
      );
      const screenshot = interaction.options.getAttachment("screenshot", true);
      const data = readReports();
      const report = {
        id: `TEST-${Date.now()}`,
        fixtureId: "TEST-FIXTURE",
        division: "Test",
        homeUsername: `${interaction.user.username} (Test)`,
        awayUsername: "Test Away Player",
        homeGoals: myGoals,
        awayGoals: opponentGoals,
        reporterUserId: interaction.user.id,
        opponentUserId: interaction.user.id,
        screenshotUrl: screenshot.url,
        status: "pending",
        test: true,
        createdAt: new Date().toISOString(),
      };
      const resultsForumName = `${fixture.division.toLowerCase()}-results`;
      const resultsForum = interaction.guild.channels.cache.find(
        (channel) =>
          channel.name === resultsForumName && channel.isThreadOnly(),
      );
      if (!resultsForum) throw new Error("#fc27-results forum was not found.");

      const thread = await resultsForum.threads.create({
        name: `TEST · FC27 result workflow · ${interaction.user.username}`.slice(
          0,
          100,
        ),
        message: {
          content: `<@${interaction.user.id}> this is a test. Select **Confirm result** or **Dispute** below.`,
          embeds: [reportEmbed(report)],
          components: [reportButtons(report.id)],
          allowedMentions: { users: [interaction.user.id] },
        },
      });
      report.threadId = thread.id;
      data.reports.push(report);
      writeReports(data);
      await interaction.editReply(
        `Test report created: <#${thread.id}>. This does not affect fixtures or standings.`,
      );
      return;
    }
    if (interaction.commandName !== "fc27-report") return;

    const fixtureId = interaction.options
      .getString("fixture", true)
      .trim()
      .toUpperCase();
    const myGoals = interaction.options.getInteger("my-goals", true);
    const opponentGoals = interaction.options.getInteger(
      "opponent-goals",
      true,
    );
    const screenshot = interaction.options.getAttachment("screenshot", true);
    const fixture = readJson(fixturesPath).fixtures.find(
      (candidate) => candidate.id === fixtureId,
    );

    if (!fixture) {
      await interaction.reply({
        content: "Fixture not found.",
        ephemeral: true,
      });
      return;
    }
    const isHome = fixture.homeDiscordUserId === interaction.user.id;
    const isAway = fixture.awayDiscordUserId === interaction.user.id;
    if (!isHome && !isAway) {
      await interaction.reply({
        content: "You are not a player in this fixture.",
        ephemeral: true,
      });
      return;
    }
    if (myGoals < opponentGoals) {
      await interaction.reply({
        content: "The winner normally reports the result.",
        ephemeral: true,
      });
      return;
    }

    const opponentUserId = isHome
      ? fixture.awayDiscordUserId
      : fixture.homeDiscordUserId;
    if (!opponentUserId) {
      await interaction.reply({
        content: "The opponent's Discord account is not linked yet.",
        ephemeral: true,
      });
      return;
    }

    const data = readReports();
    const existing = data.reports.find(
      (report) =>
        report.fixtureId === fixture.id &&
        ["pending", "confirmed"].includes(report.status),
    );
    if (existing) {
      await interaction.reply({
        content: `This fixture already has a ${existing.status} report.`,
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    const report = {
      id: `R-${Date.now()}`,
      fixtureId: fixture.id,
      division: fixture.division,
      homeUsername: fixture.homeDiscordUsername,
      awayUsername: fixture.awayDiscordUsername,
      homeGoals: isHome ? myGoals : opponentGoals,
      awayGoals: isHome ? opponentGoals : myGoals,
      reporterUserId: interaction.user.id,
      opponentUserId,
      screenshotUrl: screenshot.url,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const resultsForum = interaction.guild.channels.cache.find(
      (channel) => channel.name === "fc27-results" && channel.isThreadOnly(),
    );
    if (!resultsForum) throw new Error("#fc27-results forum was not found.");

    const thread = await resultsForum.threads.create({
      name: `${fixture.id} · ${report.homeUsername} vs ${report.awayUsername}`.slice(
        0,
        100,
      ),
      message: {
        content: `<@${opponentUserId}> please confirm or dispute this result.`,
        embeds: [reportEmbed(report)],
        components: [reportButtons(report.id)],
        allowedMentions: { users: [opponentUserId] },
      },
    });
    report.threadId = thread.id;
    data.reports.push(report);
    writeReports(data);
    await interaction.editReply(`Result submitted: <#${thread.id}>`);
  } catch (error) {
    console.error(error);
    const message = "Something went wrong. Organisers have been notified.";
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: message, ephemeral: true });
    } else {
      await interaction.reply({ content: message, ephemeral: true });
    }
  }
});

await client.login(config.token);
