package main

import (
	"context"
	"os"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx     context.Context
	dataDir string
}

type Note struct {
	Filename string `json:"filename"`
	Title    string `json:"title"`
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) domReady(ctx context.Context) {}

func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

func (a *App) shutdown(ctx context.Context) {}

// ChooseDirectory ouvre une boîte de dialogue pour choisir le dossier de stockage
func (a *App) ChooseDirectory() (string, error) {
	dir, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Choisir le dossier des notes",
	})
	if err != nil {
		return "", err
	}
	if dir != "" {
		a.dataDir = dir
	}
	return dir, nil
}

// GetDataDir retourne le dossier actuel
func (a *App) GetDataDir() string {
	return a.dataDir
}

// SetDataDir définit le dossier de stockage
func (a *App) SetDataDir(dir string) {
	a.dataDir = dir
}

// GetNotes retourne la liste des notes dans le dossier
func (a *App) GetNotes() ([]Note, error) {
	if a.dataDir == "" {
		return []Note{}, nil
	}

	entries, err := os.ReadDir(a.dataDir)
	if err != nil {
		return nil, err
	}

	var notes []Note
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".html") {
			title := strings.TrimSuffix(entry.Name(), ".html")
			notes = append(notes, Note{
				Filename: entry.Name(),
				Title:    title,
			})
		}
	}
	return notes, nil
}

// ReadNote lit le contenu d'une note
func (a *App) ReadNote(filename string) (string, error) {
	path := filepath.Join(a.dataDir, filename)
	data, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

// SaveNote sauvegarde une note (crée ou écrase)
func (a *App) SaveNote(filename string, content string) error {
	path := filepath.Join(a.dataDir, filename)
	return os.WriteFile(path, []byte(content), 0644)
}

// DeleteNote supprime une note
func (a *App) DeleteNote(filename string) error {
	path := filepath.Join(a.dataDir, filename)
	return os.Remove(path)
}

// RenameNote renomme une note
func (a *App) RenameNote(oldFilename string, newTitle string) (string, error) {
	newFilename := newTitle + ".html"
	oldPath := filepath.Join(a.dataDir, oldFilename)
	newPath := filepath.Join(a.dataDir, newFilename)
	err := os.Rename(oldPath, newPath)
	if err != nil {
		return "", err
	}
	return newFilename, nil
}
