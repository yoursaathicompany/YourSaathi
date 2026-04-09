// ============================================================
// Course Data — Python: Machine Learning & AI (Beginner → Advanced)
// 4 progressive modules from zero to production-grade.
// ============================================================

export type CodeBlock = {
  id: string;
  title: string;
  language: string;
  code: string;
  troubleshooting: { error: string; cause: string; fix: string }[];
};

export type CourseModule = {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;            // tailwind gradient segment
  objective: string[];
  estimatedHours: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  tags: string[];
  theorySections: {
    heading: string;
    content: string;        // Markdown-ish text with inline formatting
    table?: { headers: string[]; rows: string[][] };
    formula?: string;
  }[];
  codeBlocks: CodeBlock[];
  project: {
    title: string;
    description: string;
    code: CodeBlock;
  };
};

export const courseMetadata = {
  title: 'Python Machine Learning & AI — From Zero to Production',
  description:
    'A beginner-friendly, 4-module course that takes you from your first line of Python to building production-grade ML & AI systems. No prior ML experience needed — we teach everything from scratch.',
  estimatedHours: '40–60 hours',
  prerequisites: [
    'A computer with Python 3.9+ installed',
    'Basic Python syntax (variables, loops, functions — we review these!)',
    'Curiosity and willingness to learn',
    'No prior ML/AI experience required',
  ],
  requirements: `numpy==1.26.4
pandas==2.2.1
scipy==1.12.0
matplotlib==3.8.3
seaborn==0.13.2
scikit-learn==1.4.1
tensorflow==2.16.1
keras==3.1.1
nltk==3.8.1
transformers==4.39.3
datasets==2.18.0
torch==2.2.1
torchvision==0.17.1
opencv-python==4.9.0.80
Pillow==10.2.0
tqdm==4.66.2`,
};

// ── MODULE 1 ─────────────────────────────────────────────
const module1: CourseModule = {
  slug: 'supervised-learning',
  number: 1,
  title: 'Supervised Learning',
  subtitle: 'Foundations, Regression & Classification',
  emoji: '📊',
  color: 'from-blue-500 to-cyan-400',
  objective: [
    'Understand what Machine Learning is and how it differs from traditional programming.',
    'Get comfortable with Python libraries essential for ML: NumPy, Pandas, and Matplotlib.',
    'Learn data preprocessing — handling missing values, scaling, and splitting data correctly.',
    'Understand the math behind Linear Regression, Logistic Regression, and SVMs — explained step by step.',
    'Implement, tune, and evaluate supervised learning models using Scikit-Learn.',
    'Build a real-world House Price Prediction system as your first ML project.',
  ],
  estimatedHours: '12–18 hours',
  difficulty: 'Beginner',
  prerequisites: ['Python installed on your computer', 'Basic Python knowledge (variables, loops, functions)', 'No ML experience needed — we start from zero!'],
  tags: ['Python Basics', 'NumPy', 'Pandas', 'Data Preprocessing', 'Regression', 'Classification', 'SVM', 'Scikit-Learn'],
  theorySections: [
    {
      heading: '🌟 What is Machine Learning? (Start Here!)',
      content:
        'Imagine you want to build a program that recognises cats in photos. With traditional programming, you would write thousands of rules: "if the image has pointy ears AND whiskers AND fur..." — this approach breaks quickly.\n\nMachine Learning flips this on its head. Instead of writing rules, you show the computer thousands of examples (photos of cats and not-cats), and it automatically discovers the patterns. That\'s it — ML is just learning from examples.\n\nThink of it like teaching a child to recognise fruits. You don\'t explain the biology of an apple — you just show them many apples until they "get it."',
      table: {
        headers: ['Traditional Programming', 'Machine Learning'],
        rows: [
          ['You write the rules', 'The computer discovers the rules'],
          ['Input: data + rules → Output', 'Input: data + output → Rules'],
          ['Breaks with complexity', 'Improves with more data'],
          ['Example: calculator', 'Example: spam filter, Netflix recommendations'],
        ],
      },
    },
    {
      heading: '🐍 Python for ML — A Quick Crash Course',
      content:
        'Before we dive into ML, let\'s make sure you\'re comfortable with the key Python tools. You only need 3 libraries to start:\n\n1. NumPy — handles numbers and arrays (think: math on steroids)\n2. Pandas — handles tables of data (think: Excel in Python)\n3. Matplotlib — creates charts and graphs (think: visualisation)\n\nDon\'t worry if these are new to you — we\'ll use them hands-on and you\'ll pick them up naturally. The code examples below include detailed comments explaining every line.',
      table: {
        headers: ['Library', 'What It Does', 'Analogy'],
        rows: [
          ['NumPy', 'Fast math with arrays of numbers', 'A powerful calculator'],
          ['Pandas', 'Load, clean, and explore tabular data', 'Excel / Google Sheets'],
          ['Matplotlib', 'Create plots and visualisations', 'A charting tool'],
          ['Scikit-Learn', 'Build and train ML models', 'The ML toolkit'],
        ],
      },
    },
    {
      heading: '📦 Data Preprocessing 101 — Why Clean Data Matters',
      content:
        'Here\'s a secret most beginners miss: 80% of a data scientist\'s time is spent cleaning and preparing data, not building models. A perfect algorithm on garbage data will produce garbage results.\n\nKey preprocessing steps we\'ll cover:\n\n• Handling missing values — What do you do when some rows have blank cells?\n• Feature scaling — Making sure all numbers are on the same scale (e.g., age 0-100 vs salary 0-1,000,000)\n• Train/Test split — Never test on the same data you trained on (that\'s like memorising the answer key!)\n• Encoding categories — Converting text labels ("red", "blue") into numbers the model understands',
    },
    {
      heading: 'What is Supervised Learning?',
      content:
        'Now that you understand ML basics, let\'s get specific. Supervised Learning is the most common type of ML. Think "supervised" as in "learning with a teacher" — you give the model both the question AND the correct answer, and it learns the pattern.\n\nFormally: the model learns a mapping function f(X) → y from labeled data, where X is the input and y is the correct output.',
      table: {
        headers: ['Task', 'Output Type', 'Example'],
        rows: [
          ['Regression', 'A number (continuous)', 'Predicting house price (₹ 45,00,000)'],
          ['Classification', 'A category (discrete)', 'Is this email Spam or Not Spam?'],
        ],
      },
    },
    {
      heading: 'Linear Regression — Your First Algorithm',
      content:
        'Linear Regression is the "Hello World" of Machine Learning. It draws a straight line (or plane) through your data to make predictions.\n\nImagine plotting house size (x-axis) vs price (y-axis) on a graph. Linear Regression finds the best-fit line through those dots. Once you have that line, you can predict the price of ANY house by finding where its size falls on the line.\n\nMathematically, it\'s just a weighted sum: each feature (like size, location, age) gets a weight that says "how important is this?"',
      formula: 'ŷ = θ₀ + θ₁x₁ + θ₂x₂ + ... + θₙxₙ\n\nTranslation: prediction = bias + (weight₁ × feature₁) + (weight₂ × feature₂) + ...',
    },
    {
      heading: 'Cost Function — How Do We Know If the Model is Good?',
      content:
        'How does the model know if its predictions are good or bad? We need a "scorecard" — that\'s the Cost Function.\n\nThe most common one is Mean Squared Error (MSE). It works like this:\n1. For each prediction, calculate the error: (predicted - actual)\n2. Square it (so negative errors don\'t cancel out positive ones)\n3. Average all the squared errors\n\nA lower MSE = better predictions. The model\'s job is to find weights that make MSE as small as possible.',
      formula: 'J(θ) = (1 / 2m) × Σ (ŷᵢ - yᵢ)²\n\nIn plain English: Average of (prediction - actual)² across all examples',
    },
    {
      heading: 'Gradient Descent — How the Model Learns',
      content:
        'Imagine you\'re blindfolded on a hilly landscape and need to find the lowest valley. What would you do? Feel the slope under your feet and take a step downhill. Repeat until you can\'t go lower. That\'s Gradient Descent!\n\nThe model starts with random weights (random position on the hill). It calculates the slope (gradient) of the error, then takes a small step in the direction that reduces the error. After thousands of tiny steps, it reaches the minimum.\n\nThe learning rate (α) controls step size:\n• Too large → you overshoot and bounce around\n• Too small → training takes forever\n• Just right → smooth convergence (typically α = 0.001 to 0.01)',
      formula: 'θⱼ := θⱼ - α × (∂J/∂θⱼ)\n\nTranslation: new_weight = old_weight - learning_rate × slope_of_error',
    },
    {
      heading: 'Logistic Regression — Yes or No Questions',
      content:
        'What if instead of predicting a number (like price), you want to predict a category (like "Spam" or "Not Spam")?\n\nLogistic Regression takes the Linear Regression formula and squeezes it through a special S-shaped function called Sigmoid. This converts any number into a probability between 0 and 1:\n\n• Output = 0.92 → "92% chance this is spam" → classify as Spam\n• Output = 0.15 → "15% chance this is spam" → classify as Not Spam\n\nThe decision boundary is usually 0.5 — above it means "yes", below means "no".',
      formula: 'σ(z) = 1 / (1 + e⁻ᶻ)    →    Squishes any number into range (0, 1)\n\nLoss: J(θ) = -(1/m) × Σ [yᵢ log(ŷᵢ) + (1 - yᵢ) log(1 - ŷᵢ)]',
    },
    {
      heading: 'The Bias-Variance Tradeoff — The Golden Rule of ML',
      content:
        'This is the most important concept in all of ML. Every model you build faces this tension:\n\n• Underfitting (High Bias): Your model is too simple — like trying to draw a straight line through a curvy pattern. It misses the real signal. Example: predicting house prices using only the number of rooms.\n\n• Overfitting (High Variance): Your model is too complex — it memorises the training data perfectly (including noise and outliers) but fails miserably on new data. Example: a model that learns "house #47 costs ₹50 lakhs" instead of learning general patterns.\n\nThe sweet spot is a model complex enough to capture real patterns, but simple enough to generalise to unseen data.',
      table: {
        headers: ['Problem', 'Fix'],
        rows: [
          ['Underfitting', 'More features, more complex model, reduce regularization'],
          ['Overfitting', 'More data, regularization (L1/L2), cross-validation'],
        ],
      },
    },
    {
      heading: 'Regularization — Preventing Overfitting',
      content:
        'Regularization is like telling your model: "Keep it simple!" It adds a penalty for having large, complex weights.\n\nTwo common types:\n\n• Ridge (L2): Shrinks all weights towards zero, but never exactly to zero. Good when all features are somewhat useful.\n\n• Lasso (L1): Can shrink some weights to exactly zero — effectively removing useless features. Great for feature selection.\n\nThe strength of the penalty is controlled by λ (lambda). Higher λ = simpler model.',
      formula: 'Ridge: Cost = Error + λ × (sum of weights²)\nLasso: Cost = Error + λ × (sum of |weights|)\n\nλ = 0 → no regularization    λ = large → very simple model',
    },
  ],
  codeBlocks: [
    {
      id: 'm1-data-exploration',
      title: 'Step 1: Data Loading & Exploratory Analysis',
      language: 'python',
      code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import fetch_california_housing

# ── Load Dataset ──────────────────────────────────────────
housing = fetch_california_housing(as_frame=True)
df = housing.frame

print("Dataset Shape:", df.shape)
print("\\nFirst 5 rows:")
print(df.head())

print("\\nStatistical Summary:")
print(df.describe())

# ── Check for Missing Values ──────────────────────────────
print("\\nMissing Values:")
print(df.isnull().sum())

# ── Visualize Feature Correlations ───────────────────────
plt.figure(figsize=(12, 8))
sns.heatmap(df.corr(), annot=True, fmt=".2f", cmap="coolwarm", linewidths=0.5)
plt.title("Feature Correlation Heatmap", fontsize=16, pad=20)
plt.tight_layout()
plt.savefig("correlation_heatmap.png", dpi=150)
plt.show()

# ── Distribution of Target Variable ──────────────────────
plt.figure(figsize=(8, 5))
sns.histplot(df["MedHouseVal"], bins=50, kde=True, color="#4C72B0")
plt.title("Distribution of Median House Value")
plt.xlabel("Median House Value (×$100,000)")
plt.tight_layout()
plt.show()`,
      troubleshooting: [
        { error: 'ModuleNotFoundError: No module named "sklearn"', cause: 'Scikit-learn not installed', fix: 'pip install scikit-learn' },
        { error: 'ModuleNotFoundError: No module named "seaborn"', cause: 'Seaborn not installed', fix: 'pip install seaborn' },
      ],
    },
    {
      id: 'm1-preprocessing',
      title: 'Step 2: Data Preprocessing — Scaling & Split',
      language: 'python',
      code: `from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# ── Separate Features and Target ─────────────────────────
X = df.drop("MedHouseVal", axis=1)
y = df["MedHouseVal"]

# ── Train/Validation/Test Split ──────────────────────────
# 70% train, 15% validation, 15% test
X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.30, random_state=42
)
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.50, random_state=42
)

print(f"Training set:   {X_train.shape[0]} samples")
print(f"Validation set: {X_val.shape[0]} samples")
print(f"Test set:       {X_test.shape[0]} samples")

# ── Feature Scaling (StandardScaler) ─────────────────────
# Formula: z = (x - μ) / σ   (zero mean, unit variance)
scaler = StandardScaler()

# IMPORTANT: Fit ONLY on training data to prevent data leakage!
X_train_scaled = scaler.fit_transform(X_train)
X_val_scaled   = scaler.transform(X_val)     # Only transform, never fit
X_test_scaled  = scaler.transform(X_test)    # Only transform, never fit

print("\\nScaling complete. Feature means (should be ~0):")
print(np.round(X_train_scaled.mean(axis=0), 3))`,
      troubleshooting: [
        { error: 'ValueError: Input contains NaN', cause: 'Missing values in dataset', fix: 'Use df.fillna(df.median()) or SimpleImputer before scaling' },
      ],
    },
    {
      id: 'm1-model-training',
      title: 'Step 3: Model Training & Evaluation',
      language: 'python',
      code: `from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

def evaluate_model(name, model, X_tr, y_tr, X_v, y_v):
    """Train a model and print key regression metrics."""
    model.fit(X_tr, y_tr)
    preds = model.predict(X_v)

    rmse = np.sqrt(mean_squared_error(y_v, preds))
    mae  = mean_absolute_error(y_v, preds)
    r2   = r2_score(y_v, preds)

    print(f"\\n── {name} ──")
    print(f"   RMSE : {rmse:.4f}")
    print(f"   MAE  : {mae:.4f}")
    print(f"   R²   : {r2:.4f}")
    return model, preds

# ── Define Models ─────────────────────────────────────────
models = [
    ("Linear Regression",       LinearRegression()),
    ("Ridge Regression (L2)",   Ridge(alpha=1.0)),
    ("Lasso Regression (L1)",   Lasso(alpha=0.01)),
    ("Random Forest",           RandomForestRegressor(n_estimators=100, random_state=42)),
    ("Gradient Boosting",       GradientBoostingRegressor(
        n_estimators=200, learning_rate=0.1, random_state=42
    )),
]

results = {}
for name, model in models:
    trained_model, preds = evaluate_model(
        name, model,
        X_train_scaled, y_train,
        X_val_scaled, y_val
    )
    results[name] = (trained_model, preds)`,
      troubleshooting: [
        { error: 'Model R² score is negative', cause: 'Model is worse than predicting the mean', fix: 'Check for data leakage or incorrect scaler fitting' },
        { error: 'ConvergenceWarning (Lasso/Ridge)', cause: 'Solver didn\'t converge', fix: 'Increase max_iter=10000 parameter' },
      ],
    },
    {
      id: 'm1-hyperparameter',
      title: 'Step 4: Hyperparameter Tuning with Cross-Validation',
      language: 'python',
      code: `from sklearn.model_selection import GridSearchCV

# ── Define the search space ───────────────────────────────
param_grid = {
    "n_estimators":      [100, 200, 300],
    "max_depth":         [3, 5, 7, None],
    "min_samples_split": [2, 5, 10],
}

rf = RandomForestRegressor(random_state=42)

# 5-fold cross-validation with negative MSE as scoring
grid_search = GridSearchCV(
    estimator=rf,
    param_grid=param_grid,
    cv=5,
    scoring="neg_mean_squared_error",
    n_jobs=-1,     # Use all available CPU cores
    verbose=1,
)

grid_search.fit(X_train_scaled, y_train)
print("\\n✅ Best Parameters Found:")
print(grid_search.best_params_)

best_rf = grid_search.best_estimator_
test_preds = best_rf.predict(X_test_scaled)
final_r2 = r2_score(y_test, test_preds)
final_rmse = np.sqrt(mean_squared_error(y_test, test_preds))

print(f"\\n🏆 Final Test Set Performance (Best Random Forest):")
print(f"   RMSE : {final_rmse:.4f}")
print(f"   R²   : {final_r2:.4f}")

# ── Feature Importance Plot ───────────────────────────────
importances = pd.Series(best_rf.feature_importances_, index=X.columns)
importances.sort_values(ascending=True).plot(
    kind="barh", figsize=(10, 6),
    color="#2C7BB6", title="Feature Importances — Random Forest"
)
plt.tight_layout()
plt.savefig("feature_importances.png", dpi=150)
plt.show()`,
      troubleshooting: [
        { error: 'GridSearch takes hours', cause: 'Too many hyperparameter combinations', fix: 'Reduce grid size or use RandomizedSearchCV instead' },
        { error: 'MemoryError during fit', cause: 'Dataset too large for RAM', fix: 'Use partial_fit() or SGDRegressor' },
      ],
    },
    {
      id: 'm1-classification',
      title: 'Step 5: Classification — SVM with RBF Kernel',
      language: 'python',
      code: `from sklearn.datasets import load_iris
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import StratifiedKFold, cross_val_score

# ── Load Iris Dataset ──────────────────────────────────────
iris = load_iris(as_frame=True)
X_iris, y_iris = iris.data, iris.target

X_tr, X_te, y_tr, y_te = train_test_split(
    X_iris, y_iris, test_size=0.20, random_state=42, stratify=y_iris
)

sc = StandardScaler()
X_tr_sc = sc.fit_transform(X_tr)
X_te_sc = sc.transform(X_te)

# ── Train SVM with RBF Kernel ─────────────────────────────
svm = SVC(kernel="rbf", C=10.0, gamma="scale", probability=True)
svm.fit(X_tr_sc, y_tr)

y_pred = svm.predict(X_te_sc)

print("📊 Classification Report:")
print(classification_report(y_te, y_pred, target_names=iris.target_names))

# ── Confusion Matrix ──────────────────────────────────────
cm = confusion_matrix(y_te, y_pred)
plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
    xticklabels=iris.target_names, yticklabels=iris.target_names)
plt.title("Confusion Matrix — SVM Classifier")
plt.ylabel("Actual"); plt.xlabel("Predicted")
plt.tight_layout()
plt.savefig("confusion_matrix.png", dpi=150)
plt.show()

# ── 10-Fold Stratified Cross-Validation ──────────────────
cv = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
cv_scores = cross_val_score(svm, sc.fit_transform(X_iris), y_iris, cv=cv, scoring="accuracy")
print(f"\\n10-Fold CV Accuracy: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")`,
      troubleshooting: [
        { error: 'Overfitting (train acc ≈ 100%, test ≈ 60%)', cause: 'Model too complex for data', fix: 'Reduce C value, use regularization, get more data' },
      ],
    },
  ],
  project: {
    title: 'House Price Prediction System',
    description:
      'Build a production-style prediction pipeline with persistence. This project uses an Sklearn Pipeline to chain preprocessing and modeling, guaranteeing no data leakage in production.',
    code: {
      id: 'm1-project',
      title: 'House Price Prediction Pipeline',
      language: 'python',
      code: `import pickle
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error

# ── 1. Build a Reusable Pipeline ─────────────────────────
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model",  GradientBoostingRegressor(
        n_estimators=300, learning_rate=0.08,
        max_depth=5, random_state=42
    ))
])

# ── 2. Load and Prepare Data ─────────────────────────────
housing = fetch_california_housing(as_frame=True)
X, y = housing.data, housing.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ── 3. Train the Pipeline ─────────────────────────────────
pipeline.fit(X_train, y_train)

# ── 4. Evaluate ───────────────────────────────────────────
preds = pipeline.predict(X_test)
r2   = r2_score(y_test, preds)
rmse = np.sqrt(mean_squared_error(y_test, preds))
print(f"✅ Model Trained! R² = {r2:.4f} | RMSE = {rmse:.4f}")

# ── 5. Persist Model to Disk ──────────────────────────────
with open("house_price_model.pkl", "wb") as f:
    pickle.dump(pipeline, f)
print("💾 Model saved to house_price_model.pkl")

# ── 6. Production Prediction Function ─────────────────────
def predict_house_price(features: dict) -> float:
    """Accepts a dict of housing features, returns predicted price."""
    with open("house_price_model.pkl", "rb") as f:
        loaded_model = pickle.load(f)
    feature_order = [
        "MedInc", "HouseAge", "AveRooms", "AveBedrms",
        "Population", "AveOccup", "Latitude", "Longitude"
    ]
    X_new = np.array([[features[k] for k in feature_order]])
    prediction = loaded_model.predict(X_new)[0]
    return round(prediction * 100_000, 2)

# ── Example Usage ─────────────────────────────────────────
sample_house = {
    "MedInc": 8.3252, "HouseAge": 41.0, "AveRooms": 6.984,
    "AveBedrms": 1.023, "Population": 322.0, "AveOccup": 2.555,
    "Latitude": 37.88, "Longitude": -122.23,
}
price = predict_house_price(sample_house)
print(f"\\n🏠 Predicted House Price: \${price:,.2f}")`,
      troubleshooting: [
        { error: 'FileNotFoundError: house_price_model.pkl', cause: 'Model file not saved or wrong path', fix: 'Run the training step first to generate the .pkl file' },
        { error: 'KeyError in predict_house_price', cause: 'Missing feature in input dict', fix: 'Ensure all 8 features are provided with correct key names' },
      ],
    },
  },
};

// ── MODULE 2 ─────────────────────────────────────────────
const module2: CourseModule = {
  slug: 'neural-networks-deep-learning',
  number: 2,
  title: 'Neural Networks & Deep Learning',
  subtitle: 'Architecture & Training',
  emoji: '🧠',
  color: 'from-purple-500 to-pink-500',
  objective: [
    'Understand what a neural network is, starting from a single neuron and building up layer by layer.',
    'Learn activation functions, backpropagation, and optimizers — explained visually, not just mathematically.',
    'Build your first neural network with TensorFlow/Keras and train it step by step.',
    'Build CNNs for image classification and create a production-ready Customer Churn Prediction model.',
  ],
  estimatedHours: '12–18 hours',
  difficulty: 'Intermediate',
  prerequisites: ['Module 1 completed', 'Comfortable with Python and Scikit-Learn from Module 1', 'No deep math background needed — we explain everything'],
  tags: ['Neural Networks', 'CNN', 'Backpropagation', 'TensorFlow', 'Keras', 'Adam'],
  theorySections: [
    {
      heading: '🧠 What is a Neural Network? (The Big Picture)',
      content:
        'Remember how in Module 1, Linear Regression was just: output = weight × input + bias? A neural network is simply many of these stacked together in layers!\n\nA single artificial neuron works exactly like your brain cells (roughly):\n1. It receives inputs (like pixel values of an image)\n2. Each input is multiplied by a weight (how important is this input?)\n3. All weighted inputs are summed together\n4. The sum passes through an "activation function" (a decision gate)\n5. The output becomes the input for the next neuron\n\nStack hundreds of these neurons in layers → that\'s a neural network!\nStack many layers → that\'s DEEP learning.',
      formula: 'output = activation(w₁x₁ + w₂x₂ + ... + wₙxₙ + bias)\n\nIn plain English: output = activation(weighted_sum_of_all_inputs + bias)',
    },
    {
      heading: 'Activation Functions — The Decision Gates',
      content:
        'Why do we need activation functions? Without them, no matter how many layers you stack, the entire network would just be doing simple multiplication — it couldn\'t learn anything complex (like recognising a cat).\n\nActivation functions add "curves" to the model, letting it learn complex patterns. Think of them as decision gates that decide whether a neuron should "fire" or not.\n\nFor beginners: just use ReLU in hidden layers and Sigmoid/Softmax in the output layer. That covers 90% of use cases!',
      table: {
        headers: ['Function', 'Formula', 'Range', 'Best Used In'],
        rows: [
          ['Sigmoid', '1/(1+e⁻ˣ)', '(0, 1)', 'Binary output layer'],
          ['Tanh', '(eˣ-e⁻ˣ)/(eˣ+e⁻ˣ)', '(-1, 1)', 'Hidden layers (RNNs)'],
          ['ReLU', 'max(0, x)', '[0, ∞)', 'Hidden layers (default)'],
          ['Leaky ReLU', 'max(0.01x, x)', '(-∞, ∞)', 'Avoids dying ReLU'],
          ['Softmax', 'eˣⁱ / Σeˣʲ', '(0,1), sums to 1', 'Multi-class output'],
        ],
      },
    },
    {
      heading: 'Backpropagation — How Does the Network Learn?',
      content:
        'This is the magic behind deep learning. Here\'s the intuition (no calculus degree needed!):\n\n1. Forward Pass: Feed data through the network and get a prediction\n2. Calculate Error: Compare prediction to the correct answer — "how wrong were we?"\n3. Backward Pass: Go backward through each layer asking "which weights caused this mistake?"\n4. Update Weights: Adjust each weight a tiny bit to reduce the error\n5. Repeat thousands of times\n\nIt\'s like a teacher grading a test and then telling each student exactly which topics they need to study more. The "chain rule" from calculus is used to calculate how much each weight contributed — but TensorFlow handles all this math automatically!',
      formula: '∂L/∂W₁ = ∂L/∂ŷ × ∂ŷ/∂a₂ × ... × ∂z₁/∂W₁\n\nDon\'t panic! TensorFlow calculates this automatically. You just call model.fit().',
    },
    {
      heading: 'Optimizers — Choosing How to Learn',
      content:
        'Remember Gradient Descent from Module 1? Optimizers are smarter versions of it. They control HOW the model updates its weights.\n\nFor beginners: just use Adam. It\'s the default for a reason — it automatically adjusts the learning speed for each weight and works great 90% of the time. You can explore others as you gain experience.',
      table: {
        headers: ['Optimizer', 'Key Idea', 'When to Use'],
        rows: [
          ['SGD', 'Raw gradient step + momentum', 'Simple tasks, strong regularization'],
          ['Adam', 'Adapts LR per-parameter', 'Default for most networks'],
          ['AdaGrad', 'Reduces LR for frequent features', 'Sparse data (NLP)'],
          ['RMSprop', 'Moving avg of squared gradients', 'RNNs'],
        ],
      },
    },
    {
      heading: 'Batch Normalization & Dropout — Tricks That Work',
      content:
        'Two powerful techniques that make neural networks train better:\n\nBatch Normalization: Normalises the data flowing between layers so the numbers don\'t get too big or too small. Think of it as "resetting the scale" at each layer. Result: faster training and more stable.\n\nDropout: Randomly turns off some neurons during training (e.g., 40% of them each step). Why? This forces the network to not rely on any single neuron — like a sports team where everyone needs to be good, not just one star player. This prevents overfitting!',
    },
  ],
  codeBlocks: [
    {
      id: 'm2-feedforward',
      title: 'Step 1: Building a Feedforward Neural Network',
      language: 'python',
      code: `import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, callbacks
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_classification

# ── Reproducibility ───────────────────────────────────────
tf.random.set_seed(42)
np.random.seed(42)
print(f"TensorFlow Version: {tf.__version__}")

# ── Generate Synthetic Dataset ────────────────────────────
X, y = make_classification(
    n_samples=10000, n_features=20, n_informative=15,
    n_redundant=5, n_classes=2, random_state=42
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test  = scaler.transform(X_test)

# ── Build the Model ───────────────────────────────────────
def build_model(input_dim, learning_rate=0.001):
    model = keras.Sequential([
        layers.Input(shape=(input_dim,)),
        layers.Dense(256, use_bias=False),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.Dropout(0.4),
        layers.Dense(128, use_bias=False),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.Dropout(0.3),
        layers.Dense(64, activation="relu"),
        layers.Dropout(0.2),
        layers.Dense(1, activation="sigmoid"),
    ], name="deep_classifier")

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
        loss="binary_crossentropy",
        metrics=["accuracy", keras.metrics.AUC(name="auc")]
    )
    return model

model = build_model(input_dim=X_train.shape[1])
model.summary()`,
      troubleshooting: [
        { error: 'ModuleNotFoundError: No module named "tensorflow"', cause: 'TensorFlow not installed', fix: 'pip install tensorflow' },
        { error: 'CUDA out of memory', cause: 'GPU memory exhausted', fix: 'Reduce batch_size, use tf.keras.mixed_precision' },
      ],
    },
    {
      id: 'm2-training',
      title: 'Step 2: Training with Callbacks',
      language: 'python',
      code: `# ── Define Callbacks ──────────────────────────────────────
cb_early_stop = callbacks.EarlyStopping(
    monitor="val_loss", patience=15,
    restore_best_weights=True, verbose=1
)
cb_reduce_lr = callbacks.ReduceLROnPlateau(
    monitor="val_loss", factor=0.5,
    patience=7, min_lr=1e-6, verbose=1
)
cb_checkpoint = callbacks.ModelCheckpoint(
    filepath="best_model.keras",
    monitor="val_auc", save_best_only=True,
    mode="max", verbose=1
)

# ── Train ─────────────────────────────────────────────────
history = model.fit(
    X_train, y_train,
    epochs=200, batch_size=256,
    validation_split=0.15,
    callbacks=[cb_early_stop, cb_reduce_lr, cb_checkpoint],
    verbose=1
)

# ── Evaluate ──────────────────────────────────────────────
test_loss, test_acc, test_auc = model.evaluate(X_test, y_test, verbose=0)
print(f"\\n🏆 Test Accuracy : {test_acc:.4f}")
print(f"🏆 Test AUC      : {test_auc:.4f}")

# ── Plot Training Curves ──────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
for ax, metric, title in zip(axes, ["loss","accuracy","auc"], ["Loss","Accuracy","AUC"]):
    ax.plot(history.history[metric],        label="Train", linewidth=2)
    ax.plot(history.history[f"val_{metric}"], label="Val", linewidth=2, linestyle="--")
    ax.set_title(f"Training {title}", fontsize=13)
    ax.set_xlabel("Epoch"); ax.legend(); ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig("training_curves.png", dpi=150)
plt.show()`,
      troubleshooting: [
        { error: 'Loss is NaN from epoch 1', cause: 'Exploding gradients or bad LR', fix: 'Use clipnorm=1.0 in optimizer, lower learning rate' },
        { error: 'Validation loss increases immediately', cause: 'Overfitting', fix: 'Increase Dropout rate, add L2 regularization' },
      ],
    },
    {
      id: 'm2-cnn',
      title: 'Step 3: CNN for Image Classification (CIFAR-10)',
      language: 'python',
      code: `from tensorflow.keras.datasets import cifar10

# ── Load and Normalize ────────────────────────────────────
(X_train_c, y_train_c), (X_test_c, y_test_c) = cifar10.load_data()
X_train_c = X_train_c.astype("float32") / 255.0
X_test_c  = X_test_c.astype("float32")  / 255.0

CLASS_NAMES = [
    "airplane","automobile","bird","cat","deer",
    "dog","frog","horse","ship","truck"
]

# ── Build CNN ─────────────────────────────────────────────
def build_cnn():
    model = keras.Sequential([
        layers.Input(shape=(32, 32, 3)),
        layers.Conv2D(32, (3,3), padding="same", activation="relu"),
        layers.BatchNormalization(),
        layers.Conv2D(32, (3,3), padding="same", activation="relu"),
        layers.MaxPooling2D((2,2)),
        layers.Dropout(0.25),

        layers.Conv2D(64, (3,3), padding="same", activation="relu"),
        layers.BatchNormalization(),
        layers.Conv2D(64, (3,3), padding="same", activation="relu"),
        layers.MaxPooling2D((2,2)),
        layers.Dropout(0.25),

        layers.Conv2D(128, (3,3), padding="same", activation="relu"),
        layers.BatchNormalization(),
        layers.GlobalAveragePooling2D(),

        layers.Dense(256, activation="relu"),
        layers.Dropout(0.5),
        layers.Dense(10, activation="softmax"),
    ], name="cifar10_cnn")

    model.compile(
        optimizer=keras.optimizers.Adam(1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model

cnn = build_cnn()
cnn.summary()

# ── Data Augmentation ─────────────────────────────────────
data_aug = keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
    layers.RandomTranslation(0.1, 0.1),
], name="augmentation")

# ── Train ─────────────────────────────────────────────────
cnn_history = cnn.fit(
    data_aug(X_train_c), y_train_c,
    epochs=50, batch_size=128,
    validation_data=(X_test_c, y_test_c),
    callbacks=[
        callbacks.EarlyStopping(monitor="val_accuracy", patience=10, restore_best_weights=True),
        callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=5)
    ], verbose=1
)
_, test_accuracy = cnn.evaluate(X_test_c, y_test_c, verbose=0)
print(f"\\n🏆 CIFAR-10 Test Accuracy: {test_accuracy * 100:.2f}%")`,
      troubleshooting: [
        { error: 'ResourceExhaustedError', cause: 'Dataset too large for RAM', fix: 'Use tf.data.Dataset with .prefetch() and .cache()' },
        { error: 'Training very slow on CPU', cause: 'No GPU available', fix: 'Reduce model size, use smaller batches, try Google Colab' },
      ],
    },
  ],
  project: {
    title: 'Customer Churn Prediction',
    description:
      'Build a deep learning model that predicts whether a telecom customer will leave. Handles class imbalance with class weights and uses a production-ready inference function with risk classification.',
    code: {
      id: 'm2-project',
      title: 'Deep Learning Churn Predictor',
      language: 'python',
      code: `import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, callbacks
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report

# ── Simulated Telco Churn Dataset ─────────────────────────
np.random.seed(42)
n = 7000
df = pd.DataFrame({
    "tenure": np.random.randint(1, 72, n),
    "monthly_charges": np.round(np.random.uniform(20, 120, n), 2),
    "total_charges": np.round(np.random.uniform(100, 8000, n), 2),
    "num_products": np.random.randint(1, 6, n),
    "tech_support": np.random.choice([0, 1], n),
    "online_backup": np.random.choice([0, 1], n),
    "senior_citizen": np.random.choice([0, 1], n, p=[0.84, 0.16]),
    "contract_type": np.random.choice(["Month","One_Year","Two_Year"], n),
    "internet_service": np.random.choice(["DSL","Fiber","No"], n),
    "churn": ((np.random.uniform(0,1,n) < 0.05) |
              (np.random.uniform(20,120,n) > 80) &
              (np.random.randint(1,72,n) < 20)).astype(int)
})

le = LabelEncoder()
df["contract_type"]    = le.fit_transform(df["contract_type"])
df["internet_service"] = le.fit_transform(df["internet_service"])
df["charge_per_month"] = df["total_charges"] / (df["tenure"] + 1)

X = df.drop("churn", axis=1).values
y = df["churn"].values

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test  = scaler.transform(X_test)

# ── Class Weights for Imbalanced Data ─────────────────────
neg, pos = np.bincount(y_train)
class_weight = {0: (1/neg)*(len(y_train)/2.0), 1: (1/pos)*(len(y_train)/2.0)}

# ── Build Model ───────────────────────────────────────────
churn_model = keras.Sequential([
    layers.Input(shape=(X_train.shape[1],)),
    layers.Dense(128, use_bias=False),
    layers.BatchNormalization(),
    layers.Activation("relu"),
    layers.Dropout(0.35),
    layers.Dense(64, use_bias=False),
    layers.BatchNormalization(),
    layers.Activation("relu"),
    layers.Dropout(0.25),
    layers.Dense(32, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
], name="churn_predictor")

churn_model.compile(
    optimizer=keras.optimizers.Adam(5e-4),
    loss="binary_crossentropy",
    metrics=["accuracy", keras.metrics.AUC(name="auc")]
)

# ── Train ─────────────────────────────────────────────────
history = churn_model.fit(
    X_train, y_train, epochs=100, batch_size=64,
    validation_split=0.15, class_weight=class_weight,
    callbacks=[callbacks.EarlyStopping(
        monitor="val_auc", patience=15,
        restore_best_weights=True, mode="max"
    )], verbose=0
)

y_prob = churn_model.predict(X_test).flatten()
y_pred = (y_prob >= 0.50).astype(int)
print("\\n📊 Classification Report:")
print(classification_report(y_test, y_pred, target_names=["No Churn", "Churn"]))

# ── Production Inference ──────────────────────────────────
def predict_churn(customer_features: np.ndarray) -> dict:
    scaled = scaler.transform(customer_features.reshape(1, -1))
    prob = float(churn_model.predict(scaled, verbose=0)[0][0])
    risk = "🔴 HIGH" if prob > 0.70 else "🟡 MEDIUM" if prob > 0.40 else "🟢 LOW"
    return {"churn_probability": round(prob, 4), "risk_level": risk}

sample = X_test[0]
result = predict_churn(scaler.inverse_transform(sample.reshape(1,-1))[0])
print(f"\\nChurn Probability: {result['churn_probability']:.1%}")
print(f"Risk: {result['risk_level']}")`,
      troubleshooting: [
        { error: 'Accuracy stuck at ~50%', cause: 'Class imbalance', fix: 'Verify class_weight is being passed correctly' },
        { error: 'Model accuracy stuck at class distribution', cause: 'Model predicts majority class only', fix: 'Balance dataset, use weighted loss, check label encoding' },
      ],
    },
  },
};

// ── MODULE 3 ─────────────────────────────────────────────
const module3: CourseModule = {
  slug: 'nlp-transformers',
  number: 3,
  title: 'Natural Language Processing',
  subtitle: 'NLP & Transformers',
  emoji: '💬',
  color: 'from-emerald-500 to-teal-400',
  objective: [
    'Understand how computers process and understand human language — from basic text cleaning to modern AI.',
    'Learn word embeddings, attention mechanisms, and transformer architecture — explained intuitively.',
    'Fine-tune a pre-trained BERT model for sentiment analysis (even with limited data!).',
    'Build a complete AI-Powered Sentiment Analysis API for product reviews.',
  ],
  estimatedHours: '10–14 hours',
  difficulty: 'Intermediate',
  prerequisites: ['Module 1 & 2 completed', 'Comfortable with Python and neural network basics', 'No NLP experience needed — we build from scratch'],
  tags: ['NLP', 'BERT', 'Transformers', 'TF-IDF', 'Attention', 'HuggingFace'],
  theorySections: [
    {
      heading: 'The Evolution of NLP',
      content: 'How do you teach a computer to understand "I love this movie" is positive and "This movie is terrible" is negative? That\'s Natural Language Processing (NLP) — teaching machines to read, understand, and generate human language.\n\nNLP has evolved dramatically over the decades, and you\'re about to learn the cutting-edge techniques that power ChatGPT, Google Search, and Alexa.',
      table: {
        headers: ['Era', 'Method', 'Limitation'],
        rows: [
          ['1990s', 'Bag of Words, TF-IDF', 'No semantic understanding, ignores word order'],
          ['2013', 'Word2Vec, GloVe', 'Static embeddings (same vector for "bank" regardless of context)'],
          ['2018+', 'BERT, GPT, ELMo', 'Dynamic, contextual embeddings — the modern standard'],
        ],
      },
    },
    {
      heading: 'TF-IDF — Classic Text Vectorization',
      content:
        'TF-IDF assigns importance scores to words. Common words like "the" get low scores; rare but important domain words get high scores.',
      formula: 'TF-IDF(t, d) = TF(t, d) × log(N / (1 + df(t)))',
    },
    {
      heading: 'Word Embeddings — Semantic Vector Space',
      content:
        'Word2Vec (2013) represents each word as a dense vector in d-dimensional space (typically d=300), where semantically similar words cluster together.\n\nvector("king") - vector("man") + vector("woman") ≈ vector("queen")',
    },
    {
      heading: 'The Attention Mechanism',
      content:
        'The key insight: not all words are equally relevant when processing a given token. Scaled Dot-Product Attention computes a weighted sum of Values, where the weights are determined by the compatibility of Queries and Keys.',
      formula: 'Attention(Q, K, V) = softmax(QKᵀ / √dₖ) · V',
    },
    {
      heading: 'Multi-Head Attention',
      content:
        'Run attention h times in parallel with different learned projections. This allows the model to attend to different positions from different representational subspaces simultaneously.',
      formula: 'MultiHead(Q,K,V) = Concat(head₁, ..., headₕ) · Wᴼ',
    },
    {
      heading: 'BERT Architecture',
      content:
        'BERT (Bidirectional Encoder Representations from Transformers) is pre-trained on two tasks:\n\n1. Masked Language Model (MLM): 15% of tokens are masked; the model must predict them using both left and right context.\n\n2. Next Sentence Prediction (NSP): The model predicts whether sentence B follows sentence A.\n\nFine-tuning: Replace the pre-training head with a task-specific layer and train with a very small learning rate (2e-5 to 5e-5).',
    },
  ],
  codeBlocks: [
    {
      id: 'm3-tfidf',
      title: 'Step 1: Classical NLP — TF-IDF + Logistic Regression',
      language: 'python',
      code: `import numpy as np
import pandas as pd
import nltk
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

nltk.download("stopwords", quiet=True)
nltk.download("punkt", quiet=True)
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

STOP_WORDS = set(stopwords.words("english"))
stemmer = PorterStemmer()

def clean_text(text: str) -> str:
    """Lowercase, remove URLs/HTML/special chars, stem."""
    text = text.lower()
    text = re.sub(r"http\\S+|www\\S+", "", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"[^a-z\\s]", "", text)
    tokens = text.split()
    tokens = [t for t in tokens if t not in STOP_WORDS and len(t) > 2]
    tokens = [stemmer.stem(t) for t in tokens]
    return " ".join(tokens)

# ── Movie Review Sentiment Dataset ────────────────────────
reviews = [
    "This movie was absolutely fantastic! The acting was superb.",
    "Terrible film. Completely boring and a waste of time.",
    "An incredible cinematic experience. Beautifully crafted story.",
    "I fell asleep halfway through. Very disappointing.",
    "The special effects were breathtaking! Loved every minute.",
    "Poorly written script with one-dimensional characters.",
    "A masterpiece. One of the best films I have seen.",
    "Complete garbage. The director should be ashamed.",
    "Heartwarming and emotionally powerful. A must-watch.",
    "Predictable plot, cliched dialogue. Nothing new here.",
] * 100

labels = ([1, 0, 1, 0, 1, 0, 1, 0, 1, 0] * 100)

df_nlp = pd.DataFrame({"review": reviews, "sentiment": labels})
df_nlp["cleaned"] = df_nlp["review"].apply(clean_text)

X_train_nlp, X_test_nlp, y_train_nlp, y_test_nlp = train_test_split(
    df_nlp["cleaned"], df_nlp["sentiment"],
    test_size=0.2, random_state=42, stratify=df_nlp["sentiment"]
)

# ── TF-IDF + LR Pipeline ─────────────────────────────────
text_pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(
        max_features=15000, ngram_range=(1, 2),
        min_df=2, max_df=0.95, sublinear_tf=True
    )),
    ("clf", LogisticRegression(C=5.0, max_iter=1000, random_state=42))
])

text_pipeline.fit(X_train_nlp, y_train_nlp)
y_pred_nlp = text_pipeline.predict(X_test_nlp)

print("📊 TF-IDF + Logistic Regression Results:")
print(classification_report(y_test_nlp, y_pred_nlp,
    target_names=["Negative", "Positive"]))`,
      troubleshooting: [
        { error: 'LookupError: nltk resource not found', cause: 'NLTK data not downloaded', fix: 'Run nltk.download("stopwords") and nltk.download("punkt")' },
      ],
    },
    {
      id: 'm3-bert',
      title: 'Step 2: Fine-Tuning BERT for Sentiment Analysis',
      language: 'python',
      code: `import torch
from transformers import (
    BertTokenizer, BertForSequenceClassification,
    Trainer, TrainingArguments, DataCollatorWithPadding,
)
from datasets import Dataset
import numpy as np
from sklearn.metrics import accuracy_score, f1_score

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device.upper()}")

MODEL_NAME = "bert-base-uncased"
tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)
model = BertForSequenceClassification.from_pretrained(
    MODEL_NAME, num_labels=2,
    hidden_dropout_prob=0.1, attention_probs_dropout_prob=0.1,
)

def tokenize_function(examples):
    return tokenizer(
        examples["text"], truncation=True,
        max_length=128, padding=False,
    )

raw_dataset = Dataset.from_dict({"text": reviews, "label": labels})
raw_dataset = raw_dataset.train_test_split(test_size=0.2, seed=42)
tokenized_datasets = raw_dataset.map(
    tokenize_function, batched=True, remove_columns=["text"],
)

data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return {
        "accuracy": accuracy_score(labels, predictions),
        "f1": f1_score(labels, predictions, average="weighted"),
    }

training_args = TrainingArguments(
    output_dir="./bert_sentiment",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=32,
    learning_rate=2e-5,
    weight_decay=0.01,
    warmup_ratio=0.1,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="f1",
    fp16=(device == "cuda"),
    report_to="none",
)

trainer = Trainer(
    model=model, args=training_args,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["test"],
    tokenizer=tokenizer, data_collator=data_collator,
    compute_metrics=compute_metrics,
)

print("\\n🚀 Starting BERT Fine-Tuning...")
trainer.train()

results = trainer.evaluate()
print(f"\\n✅ Eval Accuracy: {results['eval_accuracy']:.4f}")
print(f"✅ Eval F1 Score: {results['eval_f1']:.4f}")

trainer.save_model("./bert_sentiment_final")
tokenizer.save_pretrained("./bert_sentiment_final")
print("💾 Model saved to ./bert_sentiment_final")`,
      troubleshooting: [
        { error: 'OSError: Can\'t load tokenizer', cause: 'Model name typo or no internet', fix: 'Check spelling; ensure internet access; run transformers-cli login' },
        { error: 'Token indices sequence length > 512', cause: 'Input too long for BERT', fix: 'Set truncation=True, max_length=512' },
        { error: 'OOM during fine-tuning', cause: 'Batch size too large', fix: 'Reduce to 8 or 4; use gradient_accumulation_steps=4' },
      ],
    },
  ],
  project: {
    title: 'AI Sentiment Analysis API',
    description:
      'A dual-mode sentiment analysis engine supporting both fast (TF-IDF) and accurate (BERT) inference modes. Production-ready with latency tracking and batch processing.',
    code: {
      id: 'm3-project',
      title: 'Sentiment Analysis Engine',
      language: 'python',
      code: `from transformers import pipeline as hf_pipeline
import time, torch, pandas as pd

# ── Load Models ───────────────────────────────────────────
bert_sentiment = hf_pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english",
    device=0 if torch.cuda.is_available() else -1,
)

class SentimentAnalysisEngine:
    """Dual-mode sentiment analyzer: fast (TF-IDF) or accurate (BERT)."""

    def __init__(self, fast_model, bert_model):
        self.fast_model = fast_model
        self.bert_model = bert_model

    def analyze(self, text: str, fast_mode: bool = False) -> dict:
        start = time.time()
        if fast_mode:
            cleaned = clean_text(text)
            pred = self.fast_model.predict([cleaned])[0]
            proba = self.fast_model.predict_proba([cleaned])[0]
            label = "POSITIVE" if pred == 1 else "NEGATIVE"
            score = float(max(proba))
            model_used = "TF-IDF + LR"
        else:
            result = self.bert_model(text[:512])[0]
            label = result["label"]
            score = result["score"]
            model_used = "DistilBERT"
        elapsed = (time.time() - start) * 1000
        return {
            "text": text[:100] + ("..." if len(text) > 100 else ""),
            "sentiment": label,
            "confidence": f"{score:.1%}",
            "model": model_used,
            "latency_ms": f"{elapsed:.1f}ms"
        }

    def batch_analyze(self, texts: list, fast_mode: bool = True) -> pd.DataFrame:
        return pd.DataFrame([self.analyze(t, fast_mode) for t in texts])

engine = SentimentAnalysisEngine(text_pipeline, bert_sentiment)

# ── Demo ──────────────────────────────────────────────────
test_reviews = [
    "Absolutely love this product! Best purchase this year.",
    "Terrible quality. Broke after 2 days. Total waste.",
    "It's okay. Does the job I suppose.",
    "Outstanding customer service! Resolved in minutes.",
    "Packaging damaged, product missing parts. Disappointed.",
]

for review in test_reviews:
    fast = engine.analyze(review, fast_mode=True)
    bert = engine.analyze(review, fast_mode=False)
    print(f"\\n📝 {fast['text']}")
    print(f"   ⚡ Fast:  {fast['sentiment']} ({fast['confidence']})")
    print(f"   🧠 BERT:  {bert['sentiment']} ({bert['confidence']})")`,
      troubleshooting: [
        { error: 'BERT training loss = 0.693 after 3 epochs', cause: 'Model not learning', fix: 'LR too small or large; try 2e-5, 3e-5, 5e-5' },
        { error: 'Accuracy stuck at class distribution', cause: 'Model predicts majority class', fix: 'Balance dataset, use weighted loss' },
      ],
    },
  },
};

// ── MODULE 4 ─────────────────────────────────────────────
const module4: CourseModule = {
  slug: 'computer-vision',
  number: 4,
  title: 'Computer Vision',
  subtitle: 'Image Processing & Detection',
  emoji: '👁️',
  color: 'from-amber-500 to-orange-400',
  objective: [
    'Understand how computers "see" images — from pixels to features to objects.',
    'Learn convolutional operations, transfer learning, and object detection — with visual explanations.',
    'Use OpenCV for classical image processing and TensorFlow for deep learning on images.',
    'Build a complete Real-Time Object Detection & Classification System.',
  ],
  estimatedHours: '10–14 hours',
  difficulty: 'Advanced',
  prerequisites: ['Module 1, 2 & 3 completed', 'Comfortable with neural networks from Module 2', 'You\'ve come a long way — this is the final module!'],
  tags: ['OpenCV', 'ResNet50', 'Transfer Learning', 'Object Detection', 'YOLO', 'EfficientNet'],
  theorySections: [
    {
      heading: '2D Convolution — The Math',
      content:
        'A 2D convolution slides a kernel K over an input I. Each filter learns to detect a specific pattern (edge, curve, texture). Stride controls how many pixels the filter moves; padding can maintain spatial dimensions.',
      formula: '(I * K)[i,j] = Σₘ Σₙ I[i+m, j+n] · K[m, n]\noutput_size = ⌊(input_size - kernel_size + 2p) / s⌋ + 1',
    },
    {
      heading: 'What Each Layer Learns',
      content:
        'CNN feature maps reveal a beautiful hierarchy:\n\n• Early layers (1-2): Horizontal/vertical edges, color gradients\n• Middle layers (3-5): Textures — grids, corners, circles\n• Deep layers (6+): High-level semantics — faces, wheels, eyes\n\nThis hierarchical composition is why CNNs are so powerful for vision.',
    },
    {
      heading: 'Transfer Learning — Standing on Giants\' Shoulders',
      content:
        'Training a ResNet-50 from scratch requires ~14 million labeled images and weeks of compute. Transfer learning instead:\n\n1. Start with a pre-trained model (ImageNet weights)\n2. Freeze the base convolutional layers\n3. Replace the final classification layer\n4. Fine-tune on your small domain-specific dataset\n\nThis works because low-level features are universal.',
    },
    {
      heading: 'ResNet — Skip Connections',
      content:
        'Very deep networks suffer from vanishing gradients. The Residual Connection creates a highway for gradients: output = F(x) + x\n\nInstead of learning H(x) directly, the layers learn the residual F(x) = H(x) - x. If identity mapping is optimal, F(x) → 0. This enables training networks 1000+ layers deep.',
      formula: 'output = F(x) + x',
    },
    {
      heading: 'Object Detection Methods',
      content:
        'YOLO (You Only Look Once) divides the image into a grid and predicts bounding boxes and class probabilities in a single forward pass — enabling real-time detection.',
      table: {
        headers: ['Task', 'Output', 'Example Method'],
        rows: [
          ['Classification', 'Class label', 'ResNet, VGG'],
          ['Localization', 'Class + bounding box', 'Two-head architecture'],
          ['Object Detection', 'Multiple classes + boxes', 'YOLO, Faster R-CNN, SSD'],
          ['Segmentation', 'Per-pixel class', 'U-Net, Mask R-CNN'],
        ],
      },
    },
  ],
  codeBlocks: [
    {
      id: 'm4-opencv',
      title: 'Step 1: Image Processing with OpenCV',
      language: 'python',
      code: `import cv2
import numpy as np
import matplotlib.pyplot as plt

def load_sample_image() -> np.ndarray:
    """Generate a synthetic test image."""
    img = np.zeros((400, 600, 3), dtype=np.uint8)
    cv2.rectangle(img, (50, 50), (200, 200), (0, 100, 255), -1)
    cv2.circle(img, (400, 200), 100, (0, 255, 100), -1)
    cv2.putText(img, "OpenCV Demo", (100, 350),
                cv2.FONT_HERSHEY_DUPLEX, 1.5, (255, 255, 255), 2)
    return img

img_bgr  = load_sample_image()
img_rgb  = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
img_gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

# ── Processing Operations ─────────────────────────────────
blurred   = cv2.GaussianBlur(img_gray, (15, 15), sigmaX=3)
edges     = cv2.Canny(img_gray, threshold1=50, threshold2=150)
sobel_x   = cv2.Sobel(img_gray, cv2.CV_64F, dx=1, dy=0, ksize=3)
sobel_y   = cv2.Sobel(img_gray, cv2.CV_64F, dx=0, dy=1, ksize=3)
sobel_mag = np.uint8(np.clip(
    np.sqrt(sobel_x**2 + sobel_y**2) / np.sqrt(sobel_x**2 + sobel_y**2).max() * 255, 0, 255
))

kernel  = np.ones((5, 5), np.uint8)
dilated = cv2.dilate(edges, kernel, iterations=2)
eroded  = cv2.erode(dilated, kernel, iterations=1)

# ── Visualization ─────────────────────────────────────────
fig, axes = plt.subplots(2, 3, figsize=(18, 10))
images = [
    (img_rgb, "Original RGB", None),
    (img_gray, "Grayscale", "gray"),
    (blurred, "Gaussian Blur", "gray"),
    (edges, "Canny Edges", "gray"),
    (sobel_mag, "Sobel Magnitude", "gray"),
    (eroded, "Morphology", "gray"),
]
for ax, (image, title, cmap) in zip(axes.flat, images):
    ax.imshow(image, cmap=cmap)
    ax.set_title(title, fontsize=13, fontweight="bold")
    ax.axis("off")
plt.suptitle("Classical Computer Vision — OpenCV", fontsize=16, y=1.01)
plt.tight_layout()
plt.savefig("cv_operations.png", dpi=150, bbox_inches="tight")
plt.show()`,
      troubleshooting: [
        { error: 'cv2.error: (-215) !_src.empty()', cause: 'Image file not found or path wrong', fix: 'Use os.path.exists() check; use raw strings r"C:\\path" on Windows' },
        { error: 'ModuleNotFoundError: No module named "cv2"', cause: 'OpenCV not installed', fix: 'pip install opencv-python' },
      ],
    },
    {
      id: 'm4-transfer',
      title: 'Step 2: Transfer Learning with ResNet50',
      language: 'python',
      code: `import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, applications, callbacks

IMG_SIZE    = (224, 224)
BATCH_SIZE  = 32
NUM_CLASSES = 5

def build_transfer_model(num_classes, base_trainable=False):
    """Two-phase transfer learning with ResNet50."""
    base_model = applications.ResNet50(
        weights="imagenet", include_top=False,
        input_shape=(*IMG_SIZE, 3)
    )
    base_model.trainable = base_trainable

    if base_trainable:
        for layer in base_model.layers[:-30]:
            layer.trainable = False

    inputs  = keras.Input(shape=(*IMG_SIZE, 3))
    x       = base_model(inputs, training=base_trainable)
    x       = layers.GlobalAveragePooling2D()(x)
    x       = layers.Dense(512, activation="relu")(x)
    x       = layers.BatchNormalization()(x)
    x       = layers.Dropout(0.4)(x)
    x       = layers.Dense(256, activation="relu")(x)
    x       = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = keras.Model(inputs, outputs, name="resnet50_transfer")
    lr = 1e-3 if not base_trainable else 1e-5
    model.compile(
        optimizer=keras.optimizers.Adam(lr),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model

# ── Build ─────────────────────────────────────────────────
phase1_model = build_transfer_model(NUM_CLASSES, base_trainable=False)
phase1_model.summary()

print("\\n✅ ResNet50 Transfer Learning ready.")
print("   Provide a directory with class subfolders to train.")
print("   data/train/class_1/*.jpg, data/train/class_2/*.jpg, ...")`,
      troubleshooting: [
        { error: 'ResourceExhaustedError during CNN training', cause: 'GPU OOM with large images', fix: 'Reduce IMG_SIZE, use batch_size=8, enable mixed precision' },
        { error: 'ValueError: Input 0 is incompatible', cause: 'Image shape mismatch', fix: 'Ensure images are resized to (224, 224, 3)' },
      ],
    },
  ],
  project: {
    title: 'End-to-End Image Classification System',
    description:
      'A production-ready image classifier using EfficientNetV2S with a multi-dropout head, inference-optimized pipeline, and batch processing support.',
    code: {
      id: 'm4-project',
      title: 'Production Image Classifier',
      language: 'python',
      code: `import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import applications, layers
from PIL import Image
import io, time

CLASSES  = ["cats", "dogs", "birds", "cars", "flowers"]
IMG_SIZE = (224, 224)

def build_production_classifier(num_classes):
    base = applications.EfficientNetV2S(
        weights="imagenet", include_top=False,
        input_shape=(*IMG_SIZE, 3),
    )
    base.trainable = False

    inputs = keras.Input(shape=(*IMG_SIZE, 3), name="image_input")
    x = applications.efficientnet_v2.preprocess_input(inputs)
    x = base(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(512, activation="relu")(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(num_classes, activation="softmax", name="predictions")(x)

    model = keras.Model(inputs, x, name="production_classifier")
    model.compile(
        optimizer=keras.optimizers.Adam(1e-3),
        loss="categorical_crossentropy", metrics=["accuracy"]
    )
    return model

def preprocess_image(image_input) -> np.ndarray:
    if isinstance(image_input, str):
        img = Image.open(image_input).convert("RGB")
    elif isinstance(image_input, bytes):
        img = Image.open(io.BytesIO(image_input)).convert("RGB")
    elif isinstance(image_input, np.ndarray):
        img = Image.fromarray(image_input.astype(np.uint8)).convert("RGB")
    else:
        img = image_input.convert("RGB")
    img = img.resize(IMG_SIZE, Image.LANCZOS)
    return np.expand_dims(np.array(img, dtype=np.float32), axis=0)

class ImageClassificationService:
    def __init__(self, model, class_names):
        self.model = model
        self.class_names = class_names
        self._warmup()

    def _warmup(self):
        dummy = np.zeros((1, *IMG_SIZE, 3), dtype=np.float32)
        _ = self.model.predict(dummy, verbose=0)
        print("✅ Model warmed up — ready for inference.")

    def predict_single(self, image_input, top_k=3):
        start = time.perf_counter()
        arr   = preprocess_image(image_input)
        probs = self.model.predict(arr, verbose=0)[0]
        elapsed = (time.perf_counter() - start) * 1000

        top_indices = np.argsort(probs)[::-1][:top_k]
        predictions = [{
            "rank": i+1,
            "class": self.class_names[idx],
            "confidence": float(probs[idx]),
            "percentage": f"{probs[idx]:.1%}",
        } for i, idx in enumerate(top_indices)]

        return {
            "top_prediction": predictions[0]["class"],
            "confidence": predictions[0]["confidence"],
            "all_predictions": predictions,
            "latency_ms": round(elapsed, 2),
        }

# ── Initialize & Demo ────────────────────────────────────
model   = build_production_classifier(len(CLASSES))
service = ImageClassificationService(model, CLASSES)

dummy_image = np.random.randint(0, 255, (*IMG_SIZE, 3), dtype=np.uint8)
result = service.predict_single(dummy_image, top_k=3)

print(f"\\n🏆 Prediction: {result['top_prediction'].upper()}")
print(f"📊 Confidence: {result['confidence']:.1%}")
print(f"⚡ Latency: {result['latency_ms']} ms")
for p in result["all_predictions"]:
    bar = "█" * int(p["confidence"] * 20)
    print(f"   #{p['rank']} {p['class']:10s} {bar:<20} {p['percentage']}")`,
      troubleshooting: [
        { error: 'AttributeError: EfficientNetV2S', cause: 'Old TensorFlow version', fix: 'Upgrade: pip install tensorflow>=2.10.0' },
        { error: 'Low accuracy despite many epochs', cause: 'Insufficient data', fix: 'Use stronger augmentation, reduce model complexity, get more data' },
      ],
    },
  },
};

export const courseModules: CourseModule[] = [module1, module2, module3, module4];
