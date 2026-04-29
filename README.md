# Pharma Manager - Pharmacy Management System

A full-stack pharmacy management application built with Django (backend) and React + Vite (frontend).

##  Architecture

```
pharmacie/
├── pharma_backend/     # Django REST API
│   ├── config/         # Django settings
│   ├── categories/     # Category management
│   ├── medicaments/    # Medicine inventory
│   └── ventes/         # Sales management
└── pharma_frontend/    # React + Vite + MUI
    └── src/
        ├── api/        # API client functions
        ├── components/ # Reusable UI components
        └── pages/      # Page components
```

##  Tech Stack

### Backend
- **Django 6.0.4** - Web framework
- **Django REST Framework** - REST API
- **PostgreSQL** - Database
- **drf-spectacular** - API documentation
- **JWT** - Authentication

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Material UI (MUI 9)** - Component library
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

##  Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (or Docker)

### Backend Setup

```bash
cd pharma_backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

The API will be available at `http://localhost:8000`




### Frontend Setup

```bash
cd pharma_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Using Docker (Optional)

```bash
# Start all services
docker-compose up --build
```

##  API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/token/` | Obtain JWT tokens |
| POST | `/api/token/refresh/` | Refresh access token |

### Medicaments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicaments/` | List all medicaments |
| GET | `/api/medicaments/{nom}/` | Get medicament details |
| POST | `/api/medicaments/` | Create medicament |
| PUT | `/api/medicaments/{nom}/` | Update medicament |
| DELETE | `/api/medicaments/{nom}/` | Delete medicament |
| GET | `/api/medicaments/alertes-stock/` | Get low stock alerts |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories/` | List all categories |
| POST | `/api/categories/` | Create category |

### Ventes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ventes/` | List all sales |
| GET | `/api/ventes/list/{date}/` | Get sales by date |
| POST | `/api/ventes/` | Create sale |
| GET | `/api/ventes/{reference}/` | Get sale details |

##  Project Structure

### Backend Models

- **Medicament**: Medicine inventory (nom, dci, categorie, form, dosage, prix_achat, prix_vente, stock_actuel, stock_minimum, date_expiration, ordonnance_requise)
- **Category**: Medicine categories (nom, description)
- **Vente**: Sales transactions (reference, date_vente, total_ttc, status, note)
- **LigneVente**: Sale line items (vente, medicament, quantite, prix_unitaire, sous_total)

### Frontend Pages

- **Login** (`/`) - User authentication
- **Dashboard** (`/dashboard`) - Overview with alerts and daily sales
- **Medicaments** (`/médicament`) - Medicine inventory management
- **Ventes** (`/vente`) - Sales management

##  Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_NAME=pharma_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your-password
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

##  Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
python manage.py migrate     # Run migrations
python manage.py createsuperuser  # Create admin user
python manage.py test        # Run tests
```

##  Running Tests

```bash
# Backend tests
cd pharma_backend
python manage.py test

# Run specific test
python manage.py test ventes.tests.VenteAPITest.test_vente_list_all -v 2
```
