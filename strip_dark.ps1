# This script removes the "dark:" prefix from Tailwind utility classes in TSX/TS/CSS files.
# After running, dark: styles become the default (dark-only app).

$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts","*.css"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # Replace dark: prefixed classes with their value only
    # Pattern: dark:some-class replaces dark:X with X for common Tailwind patterns
    $newContent = $content -replace '\bdark:', ''

    if ($newContent -ne $content) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}
Write-Host "Done."
