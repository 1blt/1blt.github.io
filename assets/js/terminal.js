/**
 * Interactive Terminal
 * Fully functional terminal with directory navigation
 */

(function() {
  'use strict';

  // Terminal state
  const state = {
    history: [],
    historyIndex: -1,
    cwd: '~',  // Current working directory
    cwdStack: ['~']
  };

  // DOM elements
  let terminal, output, inputLine, input;

  // Get prompt HTML based on current directory
  function getPrompt() {
    return `<span class="user">visitor</span><span class="at">@</span><span class="host">alanwang</span><span class="colon">:</span><span class="path">${state.cwd}</span><span class="dollar">$</span>`;
  }

  // Available commands
  const commands = {
    help: {
      description: 'Show available commands',
      execute: () => `<span class="hl">COMMANDS</span>
  whoami          who am i?
  ls              list directory contents
  cd &lt;dir&gt;        change directory
  cat &lt;file&gt;      read file
  clear           clear terminal

<span class="hl">NAVIGATION</span>
  Tab             autocomplete
  ↑ / ↓           command history`
    },

    whoami: {
      description: 'About me',
      execute: () => {
        const content = document.getElementById('content-whoami');
        return content ? content.innerHTML : 'Alan Wang';
      }
    },

    pwd: {
      description: 'Print working directory',
      execute: () => state.cwd
    },

    ls: {
      description: 'List directory contents',
      execute: (args) => {
        let target = (args[0] || state.cwd).replace(/\/+$/, '');

        if (target === '~' || (state.cwd === '~' && !args[0])) {
          return `projects/     publications.bib`;
        }

        if (target === 'projects' || target === '~/projects' || state.cwd === '~/projects') {
          const content = document.getElementById('content-projects-list');
          if (content) {
            const files = content.textContent.trim().split(/\s+/);
            // Make each file a clickable link
            return files.map(f => {
              const name = f.replace('/', '.md');
              return `<a href="#" class="file-link" data-cmd="cat projects/${name}">${name}</a>`;
            }).join('  ');
          }
          return 'No projects found.';
        }

        return `ls: cannot access '${args[0] || target}': No such file or directory`;
      }
    },

    cd: {
      description: 'Change directory',
      execute: (args) => {
        let target = args[0];

        if (!target || target === '~' || target === '') {
          state.cwd = '~';
          state.cwdStack = ['~'];
          return null;
        }

        // Strip trailing slash
        target = target.replace(/\/+$/, '');

        if (target === '..') {
          if (state.cwdStack.length > 1) {
            state.cwdStack.pop();
            state.cwd = state.cwdStack[state.cwdStack.length - 1];
          }
          return null;
        }

        if (target === '-') {
          return null;
        }

        // Check if target is a file (not a directory)
        if (isFile(target, state.cwd)) {
          return `cd: not a directory: ${target}`;
        }

        // Handle absolute paths
        if (target.startsWith('~/')) {
          const path = target;
          if (isValidPath(path)) {
            state.cwd = path;
            state.cwdStack = path.split('/').reduce((acc, part, i) => {
              if (i === 0) return [part];
              return [...acc, acc[acc.length - 1] + '/' + part];
            }, []);
            return null;
          }
          return `cd: no such file or directory: ${target}`;
        }

        // Handle relative paths
        let newPath;
        if (state.cwd === '~') {
          newPath = '~/' + target;
        } else {
          newPath = state.cwd + '/' + target;
        }

        if (isValidPath(newPath)) {
          state.cwd = newPath;
          state.cwdStack.push(newPath);
          return null;
        }

        return `cd: no such file or directory: ${target}`;
      }
    },

    cat: {
      description: 'View file contents',
      execute: (args) => {
        const file = args[0];

        if (!file) {
          return 'cat: missing file operand';
        }

        // Check if it's a directory
        const cleanFile = file.replace(/\/+$/, '');
        if (cleanFile === 'projects' || cleanFile === '~/projects') {
          return `cat: ${file}: Is a directory`;
        }

        // Publications (from ~)
        if ((file === 'publications.bib' || file === 'pubs') && state.cwd === '~') {
          const content = document.getElementById('content-publications');
          return content ? content.innerHTML : 'File not found.';
        }

        // Contact (from ~)
        if ((file === 'contact.txt' || file === 'contact') && state.cwd === '~') {
          const content = document.getElementById('content-contact');
          return content ? content.innerHTML : 'File not found.';
        }

        // Project files - handle multiple path formats
        let projectName = null;

        // From ~/projects directory: cat garball.md
        if (state.cwd === '~/projects') {
          projectName = file.replace(/\.md$/, '');
        }
        // From ~ directory: cat projects/garball.md
        else if (state.cwd === '~' && file.startsWith('projects/')) {
          projectName = file.replace(/^projects\//, '').replace(/\.md$/, '');
        }
        // Absolute path: cat ~/projects/garball.md
        else if (file.startsWith('~/projects/')) {
          projectName = file.replace(/^~\/projects\//, '').replace(/\.md$/, '');
        }

        if (projectName) {
          const content = document.getElementById('content-project-' + projectName);
          if (content) {
            return content.innerHTML;
          }
        }

        return `cat: ${file}: No such file or directory`;
      }
    },

    contact: {
      description: 'Contact information',
      execute: () => {
        const content = document.getElementById('content-contact');
        return content ? content.innerHTML : 'Contact info not available.';
      }
    },

    clear: {
      description: 'Clear terminal',
      execute: () => {
        setTimeout(() => {
          output.innerHTML = '';
          window.scrollTo(0, 0);
          input.focus();
        }, 0);
        return null;
      }
    },

    // Easter eggs
    sudo: { hidden: true, execute: () => 'Nice try.' },
    vim: { hidden: true, execute: () => 'I use VS Code btw.' },
    emacs: { hidden: true, execute: () => 'M-x butterfly' },
    exit: { hidden: true, execute: () => 'Logout? This is the web.' },
    rm: { hidden: true, execute: (args) => args.includes('-rf') ? '🔥 Nice try.' : 'Permission denied.' },
    man: { hidden: true, execute: () => 'No manual entry. Try: help' },
    echo: { hidden: true, execute: (args) => args.join(' ') },
  };

  // Aliases
  const aliases = {
    'll': 'ls -la',
    'la': 'ls -a',
    'pubs': 'cat publications.bib',
    'publications': 'cat publications.bib',
    '?': 'help',
    'h': 'help',
  };

  // Valid paths for navigation (directories only)
  function isValidPath(path) {
    path = path.replace(/\/+$/, '');
    if (path === '~') return true;
    if (path === '~/projects') return true;
    return false;
  }

  // Check if target is a file (not a directory)
  function isFile(target, cwd) {
    // Files in home directory
    if (cwd === '~') {
      if (target === 'publications.bib' || target === 'contact.txt') return true;
      if (target.startsWith('projects/') && target.endsWith('.md')) return true;
    }
    // Files in projects directory
    if (cwd === '~/projects') {
      if (target.endsWith('.md')) {
        const list = document.getElementById('content-projects-list');
        if (list && list.textContent.includes(target)) return true;
      }
    }
    // Absolute paths to files
    if (target.startsWith('~/')) {
      if (target === '~/publications.bib' || target === '~/contact.txt') return true;
      if (target.startsWith('~/projects/') && target.endsWith('.md')) return true;
    }
    return false;
  }

  // Initialize
  function init() {
    terminal = document.getElementById('terminal');
    if (!terminal) return;

    output = document.getElementById('terminal-output');
    inputLine = document.getElementById('input-line');
    input = document.getElementById('terminal-input');

    if (!input) return;

    updatePrompt();
    terminal.addEventListener('click', () => input.focus());
    input.addEventListener('keydown', handleKeydown);
    input.focus();

    // Touch chip handlers
    const chips = document.querySelectorAll('.touch-chips button');
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          executeCommand(cmd);
        }
      });
    });

    printOutput(`Type <span class="hl">help</span> for commands.`, 'system');
  }

  function updatePrompt() {
    const promptEl = document.getElementById('prompt-display');
    if (promptEl) {
      promptEl.innerHTML = getPrompt();
    }
  }

  function handleKeydown(e) {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        executeCommand(input.value);
        break;
      case 'ArrowUp':
        e.preventDefault();
        navigateHistory(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        navigateHistory(1);
        break;
      case 'Tab':
        e.preventDefault();
        autocomplete();
        break;
      case 'c':
        if (e.ctrlKey) {
          e.preventDefault();
          printOutput(getPrompt() + ' ' + input.value + '^C', 'cmd');
          input.value = '';
        }
        break;
      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          commands.clear.execute();
        }
        break;
    }
  }

  function executeCommand(cmdLine) {
    const trimmed = cmdLine.trim();

    // Fade previous output
    output.querySelectorAll('.current').forEach(el => el.classList.remove('current'));

    printOutput(getPrompt() + ' ' + escapeHtml(trimmed), 'cmd current');

    if (trimmed) {
      state.history.push(trimmed);
      state.historyIndex = state.history.length;
    }

    input.value = '';

    if (!trimmed) {
      updatePrompt();
      return;
    }

    // Parse command
    const parts = trimmed.split(/\s+/);
    let cmdName = parts[0].toLowerCase();
    let args = parts.slice(1);

    // Check aliases
    if (aliases[trimmed.toLowerCase()]) {
      const aliased = aliases[trimmed.toLowerCase()].split(/\s+/);
      cmdName = aliased[0];
      args = aliased.slice(1).concat(args);
    } else if (aliases[cmdName]) {
      const aliased = aliases[cmdName].split(/\s+/);
      cmdName = aliased[0];
      args = aliased.slice(1).concat(args);
    }

    // Execute
    const cmd = commands[cmdName];
    if (cmd) {
      const result = cmd.execute(args);
      if (result !== null && result !== undefined) {
        printOutput(result, 'out current');
      }
    } else {
      printOutput(`${cmdName}: command not found`, 'err current');
    }

    updatePrompt();
    scrollToBottom();
  }

  function printOutput(html, type = '') {
    const line = document.createElement('div');
    line.className = 'line ' + type;
    line.innerHTML = html;
    output.appendChild(line);

    // Add click handlers for file links
    line.querySelectorAll('.file-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = link.getAttribute('data-cmd');
        if (cmd) executeCommand(cmd);
      });
    });

    initGalleries();
    scrollToBottom();
  }

  function scrollToBottom() {
    // Scroll touch chips into view (or input line on desktop)
    const chips = document.getElementById('touch-chips');
    if (chips && chips.offsetParent !== null) {
      // Touch chips are visible, scroll to them
      chips.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      inputLine.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function navigateHistory(dir) {
    if (!state.history.length) return;

    state.historyIndex += dir;

    if (state.historyIndex < 0) state.historyIndex = 0;
    if (state.historyIndex >= state.history.length) {
      state.historyIndex = state.history.length;
      input.value = '';
      return;
    }

    input.value = state.history[state.historyIndex];
    setTimeout(() => input.selectionStart = input.selectionEnd = input.value.length, 0);
  }

  function autocomplete() {
    const val = input.value;
    if (!val) return;

    const parts = val.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] || '';

    // Autocomplete commands
    if (parts.length === 1) {
      const cmds = Object.keys(commands).filter(c => !commands[c].hidden && c.startsWith(cmd));
      if (cmds.length === 1) {
        input.value = cmds[0] + ' ';
      } else if (cmds.length > 1) {
        printOutput(getPrompt() + ' ' + val, 'cmd');
        printOutput(cmds.join('  '), 'out');
      }
      return;
    }

    // Autocomplete paths for cd/cat/ls
    if (cmd === 'cd' || cmd === 'cat' || cmd === 'ls') {
      const completions = getPathCompletions(arg);
      if (completions.length === 1) {
        input.value = cmd + ' ' + completions[0];
      } else if (completions.length > 1) {
        printOutput(getPrompt() + ' ' + val, 'cmd');
        printOutput(completions.join('  '), 'out');
      }
    }
  }

  function getPathCompletions(partial) {
    const items = [];

    if (state.cwd === '~') {
      // Check if user is typing a path into projects/
      if (partial.startsWith('projects/')) {
        const subPartial = partial.replace(/^projects\//, '');
        const list = document.getElementById('content-projects-list');
        if (list) {
          const projectFiles = list.textContent.trim().split(/\s+/).map(p => 'projects/' + p.replace('/', '.md'));
          if (!subPartial) return projectFiles;
          return projectFiles.filter(i => i.toLowerCase().startsWith(partial.toLowerCase()));
        }
      }
      items.push('projects/', 'publications.bib');
    } else if (state.cwd === '~/projects') {
      const list = document.getElementById('content-projects-list');
      if (list) {
        items.push(...list.textContent.trim().split(/\s+/).map(p => p.replace('/', '.md')));
      }
    }

    if (!partial) return items;
    return items.filter(i => i.toLowerCase().startsWith(partial.toLowerCase()));
  }

  function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  // Initialize GLightbox for image grids
  let lightboxInstance = null;

  function initGalleries() {
    // Destroy previous instance if exists
    if (lightboxInstance) {
      lightboxInstance.destroy();
      lightboxInstance = null;
    }

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const glightboxElements = output.querySelectorAll('.glightbox');
      if (glightboxElements.length > 0 && typeof GLightbox !== 'undefined') {
        lightboxInstance = GLightbox({
          selector: '#terminal-output .glightbox',
          touchNavigation: true,
          loop: true,
          autoplayVideos: true,
          openEffect: 'fade',
          closeEffect: 'fade',
          slideEffect: 'slide',
          keyboardNavigation: true,
          closeOnOutsideClick: true,
          skin: 'clean'
        });
      }
    }, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
