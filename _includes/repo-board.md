<section class="homepage-block" id="repo-board">
  <div class="section-heading">
    <span class="section-kicker">Open Source</span>
    <h2>Repository Board</h2>
    <p>
      This academic homepage template is a deeply customized fork of the open-source
      <a href="https://github.com/yaoyao-liu/minimal-light" target="_blank" rel="noopener">Minimal Light</a>
      theme. The live repository board below is loaded from the GitHub API.
    </p>
  </div>

  <div
    class="repo-board"
    data-repo-owner="{{ site.repo_board.owner }}"
    data-repo-name="{{ site.repo_board.name }}"
    data-repo-url="{{ site.repo_board.url }}">
    <div class="repo-board-header">
      <div>
        <h3 id="repo-board-title">{{ site.repo_board.owner }}/{{ site.repo_board.name }}</h3>
        <p id="repo-board-description">Loading repository metadata from GitHub...</p>
      </div>
      <a
        href="{{ site.repo_board.url }}"
        class="timeline-link"
        id="repo-board-link"
        target="_blank"
        rel="noopener">View Repository</a>
    </div>

    <div class="repo-stats-grid">
      <article class="repo-stat-card">
        <span class="repo-stat-label">Stars</span>
        <strong id="repo-stars">--</strong>
      </article>
      <article class="repo-stat-card">
        <span class="repo-stat-label">Forks</span>
        <strong id="repo-forks">--</strong>
      </article>
      <article class="repo-stat-card">
        <span class="repo-stat-label">Open Issues</span>
        <strong id="repo-issues">--</strong>
      </article>
      <article class="repo-stat-card">
        <span class="repo-stat-label">Watchers</span>
        <strong id="repo-watchers">--</strong>
      </article>
      <article class="repo-stat-card">
        <span class="repo-stat-label">Default Branch</span>
        <strong id="repo-branch">--</strong>
      </article>
      <article class="repo-stat-card">
        <span class="repo-stat-label">Last Push</span>
        <strong id="repo-updated">--</strong>
      </article>
    </div>

    <div class="repo-board-footer">
      <p id="repo-license">License: --</p>
      <div class="repo-actions">
        <a class="timeline-link" id="repo-issues-link" href="{{ site.repo_board.url }}/issues" target="_blank" rel="noopener">Issues</a>
        <a class="timeline-link" id="repo-theme-link" href="https://github.com/yaoyao-liu/minimal-light" target="_blank" rel="noopener">Minimal Light</a>
      </div>
    </div>
  </div>
</section>
