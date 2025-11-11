# 🧓 Exploratory Data Analysis on Crimes Against Senior Citizens in India

## 📄 Project Overview
This project focuses on understanding the patterns and trends of crimes committed against senior citizens across different Indian states. Using open government data from **NITI Aayog (NDAP)**, the analysis identifies key hotspots, crime types, and patterns to provide actionable insights for improving safety and policy decisions.

**Dataset Source:** [NDAP - Crime Against Senior Citizens (NITI Aayog)](https://ndap.niti.gov.in/dataset/9309)  
**Analysis Notebook:** [Google Colab Link](https://colab.research.google.com/drive/1kIJl4D087K-KI_EAxcGZUFwZ7EW8q7n3?usp=sharing)

<img width="1919" height="1076" alt="Screenshot 2025-11-05 215351" src="https://github.com/user-attachments/assets/537a365a-855e-47ea-9fbf-190df747a96c" />


## 🎯 Problem Statement
Senior citizens represent one of the most vulnerable sections of society. This study analyzes crime data to identify:
- States with the highest crime rates against senior citizens.
- The most frequent types of crimes.
- Yearly and regional trends.
- Actionable insights to enhance safety for elderly populations.

---

## 🧹 Data Preprocessing
1. Loaded raw dataset from NDAP.
2. Cleaned and standardized column names.
3. Extracted numeric year values.
4. Removed inconsistencies and missing data.
5. Prepared cleaned dataset for EDA.

Files included:
- `Senior Citizen.csv` → Raw dataset  
- `Senior_Citizen_Cleaned.csv` → Cleaned dataset after preprocessing
- <img width="1861" height="700" alt="Screenshot 2025-11-05 215410" src="https://github.com/user-attachments/assets/6c9252cf-4d93-45a3-bf56-328f4762666a" />


---

## 📊 Exploratory Data Analysis (EDA)
The analysis focuses on:
- **Year-wise trends** in reported cases and victims.  
- **State-wise crime rates** per lakh population.  
- **Top 10 crime categories** by number of incidents.  
- **Hotspot visualization** for top three crime types.

### 🔍 Key Findings
| Crime Type | Hotspot State | Insight |
|-------------|----------------|---------|
| Simple Hurt | Madhya Pradesh | Highest rate of physical assault cases against seniors. |
| Theft | Maharashtra | Three times higher theft incidents than any other state. |
| Forgery, Cheating & Fraud | Maharashtra, Telangana, Karnataka | Indicates a rise in financial scams targeting seniors. |

---

## 🥧 Hotspot Visualization
The following pie chart shows the hotspot states for the top 3 crimes:

```python
import matplotlib.pyplot as plt

labels = ['Madhya Pradesh (Simple Hurt)', 'Maharashtra (Theft & Fraud)', 'Telangana (Fraud)', 'Karnataka (Fraud)']
sizes = [1, 2, 0.5, 0.5]
colors = ['#FF9999','#66B3FF','#99FF99','#FFCC99']

plt.figure(figsize=(8,8))
plt.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=140)
plt.title('Hotspot States for Top 3 Crimes Against Senior Citizens')
plt.axis('equal')
plt.show()
<img width="1790" height="972" alt="Screenshot 2025-11-05 215427" src="https://github.com/user-attachments/assets/35b377eb-0050-4556-9207-9ce4b1a56f4c" />

#Tech Stack
Language: Python
Libraries: Pandas, NumPy, Matplotlib, Seaborn
Environment: Google Colab
Visualization Tool: Matplotlib/Seaborn


