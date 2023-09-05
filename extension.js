"use strict";

const vscode = require("vscode");

// Function to convert UNIX timestamp to human-readable format
function convertTimestamp(timestamp) {
  const input = parseInt(timestamp, 10);

  if (isNaN(input)) {
    return "Invalid timestamp";
  }

  // Detect if the timestamp is in milliseconds or seconds
  const isMilliseconds = timestamp.length === 13;

  const date = isMilliseconds ? new Date(input) : new Date(input * 1000);

  // Format the date and time
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  };

  return date.toLocaleString(undefined, options);
}

function activate(context) {
  // Register the command to convert current time to a timestamp
  const convertCurrentTimeDisposable = vscode.commands.registerCommand(
    "extension.convertCurrentTimeToTimestamp",
    () => {
      const currentTimestamp = Date.now();
      vscode.window.showInformationMessage(
        `Current Timestamp: ${currentTimestamp}`
      );
    }
  );

  // Register the command to toggle the timestamp converter
  const toggleExtensionDisposable = vscode.commands.registerCommand(
    "extension.toggleTimestampConverter",
    async () => {
      const editor = vscode.window.activeTextEditor;

      // Check if there is an active text editor
      if (!editor) {
        vscode.window.showErrorMessage("No active text editor found.");
        return;
      }

      // Get the selected text in the editor
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText) {
        vscode.window.showErrorMessage("No text selected in the editor.");
        return;
      }

      // Use the selected text as the default input
      const input = await vscode.window.showInputBox({
        prompt: "Enter a UNIX timestamp",
        placeHolder: "Timestamp",
        value: selectedText, // Set the selected text as the default value
      });

      if (input !== undefined) {
        const output = convertTimestamp(input);
        if (output === "Invalid timestamp") {
          vscode.window.showErrorMessage("Invalid timestamp entered.");
        } else {
          vscode.window.showInformationMessage(output);
        }
      }
    }
  );

  context.subscriptions.push(
    convertCurrentTimeDisposable,
    toggleExtensionDisposable
  );
}

exports.activate = activate;

// Deactivation function (no implementation needed)
function deactivate() {}

exports.deactivate = deactivate;
